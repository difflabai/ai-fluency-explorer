import { supabase } from '@/integrations/supabase/client';
import { DBQuestion } from './types/questionTypes';

export const fetchQuestions = async (
  testType?: 'quick' | 'comprehensive'
): Promise<DBQuestion[]> => {
  try {
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

      return data || [];
    }

    // Map the frontend test type to database test type name
    const testTypeName =
      testType === 'quick' ? 'Quick Assessment' : 'Comprehensive Assessment';

    // Get test type ID
    const { data: testTypeData, error: testTypeError } = await supabase
      .from('test_types')
      .select('id, name, question_limit')
      .eq('name', testTypeName)
      .eq('is_active', true)
      .single();

    if (testTypeError || !testTypeData) {
      console.error('Error fetching test type:', testTypeError);

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

      return fallbackData || [];
    }

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

      return directData || [];
    }

    if (!mappingData || mappingData.length === 0) {
      // Try to populate the test questions if mapping is empty
      try {
        const { data: populateResult, error: populateError } = await supabase.rpc(
          'populate_test_questions',
          {
            test_type_name: testTypeName,
            question_limit: testTypeData.question_limit,
          }
        );

        if (populateError) {
          console.error('Error populating test questions:', populateError);
        } else {
          // Retry fetching mappings
          const { data: retryMappingData, error: retryMappingError } = await supabase
            .from('test_questions_map')
            .select('question_id')
            .eq('test_type_id', testTypeData.id);

          if (!retryMappingError && retryMappingData && retryMappingData.length > 0) {
            // Use the newly populated mappings
            const questionIds = retryMappingData.map((mapping) => mapping.question_id);

            const { data: questions, error: questionError } = await supabase
              .from('questions')
              .select('*')
              .in('id', questionIds)
              .eq('is_active', true);

            if (!questionError && questions) {
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

      return finalFallbackData || [];
    }

    // Get the actual question data using the mappings
    const questionIds = mappingData.map((mapping) => mapping.question_id);

    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .in('id', questionIds)
      .eq('is_active', true);

    if (questionError || !questions) {
      console.error('Error fetching questions by IDs:', questionError);
      return [];
    }

    return questions;
  } catch (error) {
    console.error('Exception in fetchQuestions:', error);
    return [];
  }
};
