
import { DBQuestion, DBCategory } from './types/questionTypes';

export const convertDBQuestionToAppFormat = (
  dbQuestion: DBQuestion,
  categoriesMap: Map<string, DBCategory>
) => {
  const category = categoriesMap.get(dbQuestion.category_id);
  
  // Log the explanation for debugging
  console.log(`Converting question: "${dbQuestion.text.substring(0, 50)}..." - Explanation: "${dbQuestion.explanation?.substring(0, 100) || 'NONE'}..."`);
  
  return {
    id: parseInt(dbQuestion.id.slice(0, 8), 16), // Generate a numeric ID from UUID
    text: dbQuestion.text,
    correctAnswer: dbQuestion.correct_answer,
    category: category ? category.name : 'unknown',
    difficulty: dbQuestion.difficulty,
    explanation: dbQuestion.explanation || '', // Ensure we pass the explanation from DB
    dbId: dbQuestion.id // Keep the original DB ID for reference
  };
};
