import { DBQuestion, DBCategory } from './types/questionTypes';

export const convertDBQuestionToAppFormat = (
  dbQuestion: DBQuestion,
  categoriesMap: Map<string, DBCategory>
) => {
  const category = categoriesMap.get(dbQuestion.category_id);

  // Ensure we have a proper explanation
  const explanation = dbQuestion.explanation?.trim() || '';

  return {
    id: parseInt(dbQuestion.id.slice(0, 8), 16), // Generate a numeric ID from UUID
    text: dbQuestion.text,
    correctAnswer: dbQuestion.correct_answer,
    category: category ? category.name : 'unknown',
    difficulty: dbQuestion.difficulty,
    explanation: explanation, // Pass through the explanation directly
    dbId: dbQuestion.id, // Keep the original DB ID for reference
  };
};
