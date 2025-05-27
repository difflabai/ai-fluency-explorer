
import { supabase } from "@/integrations/supabase/client";
import { DBQuestion } from './types/questionTypes';

export const fetchQuestions = async (testType?: 'quick' | 'comprehensive'): Promise<DBQuestion[]> => {
  try {
    console.log('fetchQuestions called with testType:', testType);
    
    if (!testType) {
      // If no test type is specified, fetch all active questions
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true);
        
      if (error) {
        console.error('Error fetching questions:', error);
        return [];
      }
      
      console.log('Fetched all active questions:', data?.length || 0);
      return data || [];
    }
    
    // Map the frontend test type to database test type name
    const testTypeName = testType === 'quick' ? 'Quick Assessment' : 'Comprehensive Assessment';
    
    console.log('Looking for test type:', testTypeName);
    
    // Get test type ID
    const { data: testTypeData, error: testTypeError } = await supabase
      .from('test_types')
      .select('id, name, question_limit')
      .eq('name', testTypeName)
      .eq('is_active', true)
      .single();
      
    if (testTypeError || !testTypeData) {
      console.error('Error fetching test type:', testTypeError);
      console.warn('Test type not found, falling back to all active questions');
      
      // Fallback to all active questions if test type not found
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .limit(testType === 'quick' ? 20 : 50); // Reasonable limits
        
      if (fallbackError) {
        console.error('Error in fallback query:', fallbackError);
        return [];
      }
      
      console.log('Fallback: fetched questions:', fallbackData?.length || 0);
      return fallbackData || [];
    }
    
    console.log('Found test type:', testTypeData);
    
    // Get questions linked to this test type
    const { data: mappingData, error: mappingError } = await supabase
      .from('test_questions_map')
      .select('question_id')
      .eq('test_type_id', testTypeData.id);
      
    if (mappingError) {
      console.error('Error fetching question mappings:', mappingError);
      // Fallback to direct question fetch with limit
      const { data: directData, error: directError } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .limit(testTypeData.question_limit || (testType === 'quick' ? 20 : 50));
        
      if (directError) {
        console.error('Error in direct fetch fallback:', directError);
        return [];
      }
      
      console.log('Direct fetch fallback: got questions:', directData?.length || 0);
      return directData || [];
    }
    
    if (!mappingData || mappingData.length === 0) {
      console.warn('No question mappings found for test type:', testTypeName);
      console.log('Attempting to populate test questions...');
      
      // Try to populate the test questions if mapping is empty
      try {
        const { data: populateResult, error: populateError } = await supabase
          .rpc('populate_test_questions', {
            test_type_name: testTypeName,
            question_limit: testTypeData.question_limit
          });
          
        if (populateError) {
          console.error('Error populating test questions:', populateError);
        } else {
          console.log('Populated test questions:', populateResult);
          
          // Retry fetching mappings
          const { data: retryMappingData, error: retryMappingError } = await supabase
            .from('test_questions_map')
            .select('question_id')
            .eq('test_type_id', testTypeData.id);
            
          if (!retryMappingError && retryMappingData && retryMappingData.length > 0) {
            // Use the newly populated mappings
            const questionIds = retryMappingData.map(mapping => mapping.question_id);
            
            const { data: questions, error: questionError } = await supabase
              .from('questions')
              .select('*')
              .in('id', questionIds)
              .eq('is_active', true);
              
            if (!questionError && questions) {
              console.log('Successfully fetched questions after population:', questions.length);
              return questions;
            }
          }
        }
      } catch (populateErr) {
        console.error('Exception during test population:', populateErr);
      }
      
      // Final fallback - get questions directly with appropriate limit
      const { data: finalFallbackData, error: finalFallbackError } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .limit(testTypeData.question_limit || (testType === 'quick' ? 20 : 50));
        
      if (finalFallbackError) {
        console.error('Error in final fallback:', finalFallbackError);
        return [];
      }
      
      console.log('Final fallback: fetched questions:', finalFallbackData?.length || 0);
      return finalFallbackData || [];
    }
    
    // Get the actual question data using the mappings
    const questionIds = mappingData.map(mapping => mapping.question_id);
    console.log('Question IDs from mapping:', questionIds.length);
    
    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .in('id', questionIds)
      .eq('is_active', true);
      
    if (questionError || !questions) {
      console.error('Error fetching questions by IDs:', questionError);
      return [];
    }
    
    // Log explanation status for debugging
    const questionsWithExplanations = questions.filter(q => q.explanation && q.explanation.trim().length > 0);
    const questionsWithoutExplanations = questions.filter(q => !q.explanation || q.explanation.trim().length === 0);
    
    console.log(`✅ Questions with explanations: ${questionsWithExplanations.length}`);
    console.log(`❌ Questions without explanations: ${questionsWithoutExplanations.length}`);
    
    // Show sample explanations for debugging
    if (questionsWithExplanations.length > 0) {
      console.log("📝 Sample explanations from fetchQuestions:");
      questionsWithExplanations.slice(0, 3).forEach((q, index) => {
        console.log(`${index + 1}. "${q.text.substring(0, 50)}..." - "${q.explanation?.substring(0, 100)}..."`);
      });
    }
    
    console.log('Successfully fetched mapped questions:', questions.length);
    return questions;
    
  } catch (error) {
    console.error('Exception in fetchQuestions:', error);
    return [];
  }
};
