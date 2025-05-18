
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

// Fetch active questions for the specified test type
export const fetchQuestions = async (testType: 'quick' | 'comprehensive'): Promise<DBQuestion[]> => {
  try {
    // For quick assessment, limit to 50 questions (10 from each category)
    // For comprehensive, get all active questions
    const limit = testType === 'quick' ? 50 : undefined;
    
    let query = supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .order('difficulty', { ascending: true });
      
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
    
    return data || [];
    
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

// Function to migrate existing questions from testData.ts to the database
export const migrateQuestionsToDatabase = async () => {
  try {
    // This function can be called to populate the database with questions from testData.ts
    // It should only be run once, and can be removed after initial data migration
    
    // Implementation would go here
    console.log("Migration function called - would need to be implemented for actual migration");
    
    return true;
  } catch (error) {
    console.error('Error in migrateQuestionsToDatabase:', error);
    return false;
  }
};
