
import { supabase } from "@/integrations/supabase/client";
import { Category } from '@/utils/testData';

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
export const fetchQuestions = async (testType: 'quick' | 'comprehensive'): Promise<DBQuestion[]> => {
  try {
    // Map the frontend test type to database test type name
    const testTypeName = testType === 'quick' ? 'Quick Assessment' : 'Comprehensive Assessment';
    
    // Get test type ID
    const { data: testTypeData, error: testTypeError } = await supabase
      .from('test_types')
      .select('id')
      .eq('name', testTypeName)
      .eq('is_active', true)
      .single();
      
    if (testTypeError || !testTypeData) {
      console.error('Error fetching test type:', testTypeError);
      return [];
    }
    
    // Get questions linked to this test type
    const { data, error } = await supabase
      .from('test_questions_map')
      .select('question_id')
      .eq('test_type_id', testTypeData.id);
      
    if (error || !data) {
      console.error('Error fetching question mappings:', error);
      return [];
    }
    
    // Get the actual question data
    if (data.length === 0) {
      console.warn('No questions found for test type:', testTypeName);
      return [];
    }
    
    const questionIds = data.map(mapping => mapping.question_id);
    
    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .in('id', questionIds);
      
    if (questionError || !questions) {
      console.error('Error fetching questions:', questionError);
      return [];
    }
    
    return questions;
    
  } catch (error) {
    console.error('Error in fetchQuestions:', error);
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
    // This function should be updated to also populate the test_questions_map table
    // It should only be run once, and can be removed after initial data migration
    
    // Implementation would go here
    console.log("Migration function called - would need to be implemented for actual migration");
    
    // After migrating questions, we should also call the database function to populate test types
    const { data, error } = await supabase.rpc(
      'populate_test_questions',
      { test_type_name: 'Quick Assessment', question_limit: 50 }
    );
    
    if (error) {
      console.error('Error populating Quick Assessment test:', error);
    } else {
      console.log(`Populated Quick Assessment with ${data} questions`);
    }
    
    const { data: compData, error: compError } = await supabase.rpc(
      'populate_test_questions',
      { test_type_name: 'Comprehensive Assessment' }
    );
    
    if (compError) {
      console.error('Error populating Comprehensive Assessment test:', compError);
    } else {
      console.log(`Populated Comprehensive Assessment with ${compData} questions`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in migrateQuestionsToDatabase:', error);
    return false;
  }
};
