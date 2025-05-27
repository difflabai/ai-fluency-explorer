
import { fetchQuestions } from './questionFetchService';
import { fetchCategories } from './categoryService';
import { convertDBQuestionToAppFormat } from './questionConverterService';
import { saveUserAnswers } from './userAnswerService';
import { migrateQuestionsToDatabase } from './migrationService';

// Re-export types for backward compatibility
export type { DBQuestion, DBCategory, DBTestType } from './types/questionTypes';

// Re-export all the functions to maintain API compatibility
export { fetchQuestions } from './questionFetchService';
export { fetchCategories } from './categoryService';
export { convertDBQuestionToAppFormat } from './questionConverterService';
export { saveUserAnswers } from './userAnswerService';
export { migrateQuestionsToDatabase } from './migrationService';

// Main function that combines the services
export const getQuestionsForTest = async (testType: 'quick' | 'comprehensive') => {
  const [dbQuestions, dbCategories] = await Promise.all([
    fetchQuestions(testType),
    fetchCategories()
  ]);
  
  // Create a map of category IDs to categories for faster lookups
  const categoriesMap = new Map();
  dbCategories.forEach(category => {
    categoriesMap.set(category.id, category);
  });
  
  // Convert DB questions to app format
  return dbQuestions.map(q => convertDBQuestionToAppFormat(q, categoriesMap));
};
