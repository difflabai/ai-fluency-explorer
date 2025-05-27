import { supabase } from "@/integrations/supabase/client";
import { Category } from '@/utils/testData';
import { migrateAndNotify } from '@/utils/databaseMigration';
import { toast } from "@/hooks/use-toast";

// Define types to match our database schema
export interface DBQuestion {
  id: string;
  text: string;
  category_id: string;
  difficulty: 'novice' | 'advanced-beginner' | 'competent' | 'proficient' | 'expert';
  version: number;
  is_active: boolean;
  correct_answer: boolean;
  created_at: string;
  updated_at: string;
  parent_question_id: string | null;
}

export interface DBCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface DBTestType {
  id: string;
  name: string;
  description: string | null;
  question_limit: number | null;
  created_at: string;
  is_active: boolean;
}

// Fetch questions for the specified test type
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
    
    console.log('Successfully fetched mapped questions:', questions.length);
    return questions;
    
  } catch (error) {
    console.error('Exception in fetchQuestions:', error);
    return [];
  }
};

// Fetch all categories
export const fetchCategories = async (): Promise<DBCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
      
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data || [];
    
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    return [];
  }
};

// Convert database questions to the format used by the application
export const convertDBQuestionToAppFormat = (
  dbQuestion: DBQuestion,
  categoriesMap: Map<string, DBCategory>
) => {
  const category = categoriesMap.get(dbQuestion.category_id);
  return {
    id: parseInt(dbQuestion.id.slice(0, 8), 16), // Generate a numeric ID from UUID
    text: dbQuestion.text,
    correctAnswer: dbQuestion.correct_answer,
    category: category ? category.name : 'unknown',
    difficulty: dbQuestion.difficulty,
    dbId: dbQuestion.id // Keep the original DB ID for reference
  };
};

// Fetch questions and convert to app format
export const getQuestionsForTest = async (testType: 'quick' | 'comprehensive') => {
  const [dbQuestions, dbCategories] = await Promise.all([
    fetchQuestions(testType),
    fetchCategories()
  ]);
  
  // Create a map of category IDs to categories for faster lookups
  const categoriesMap = new Map<string, DBCategory>();
  dbCategories.forEach(category => {
    categoriesMap.set(category.id, category);
  });
  
  // Convert DB questions to app format
  return dbQuestions.map(q => convertDBQuestionToAppFormat(q, categoriesMap));
};

// Save user answers to the database
export const saveUserAnswers = async (
  testResultId: string,
  answers: { questionId: string, answer: boolean }[]
) => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Prepare the answers with the user ID
    const answersWithUserId = answers.map(answer => ({
      question_id: answer.questionId,
      answer: answer.answer,
      test_result_id: testResultId,
      user_id: userId
    }));
    
    const { error } = await supabase
      .from('user_answers')
      .insert(answersWithUserId);
      
    if (error) {
      console.error('Error saving user answers:', error);
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('Error in saveUserAnswers:', error);
    return false;
  }
};

// Update the migrate function to handle test types
export const migrateQuestionsToDatabase = async () => {
  try {
    // Call our updated migration function that handles everything
    return await migrateAndNotify();
  } catch (error) {
    console.error('Error in migrateQuestionsToDatabase:', error);
    toast({
      title: "Migration Failed",
      description: "Failed to migrate questions. See console for details.",
      variant: "destructive"
    });
    return false;
  }
};
