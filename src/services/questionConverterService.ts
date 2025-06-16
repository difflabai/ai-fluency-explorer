
import { DBQuestion, DBCategory } from './types/questionTypes';

export const convertDBQuestionToAppFormat = (
  dbQuestion: DBQuestion,
  categoriesMap: Map<string, DBCategory>
) => {
  const category = categoriesMap.get(dbQuestion.category_id);
  
  // Ensure we have a proper explanation
  const explanation = dbQuestion.explanation?.trim() || '';
  
  // Enhanced logging for debugging balanced distribution
  console.log(`Converting question: "${dbQuestion.text.substring(0, 50)}..." - Category: ${category?.name || 'unknown'}, Difficulty: ${dbQuestion.difficulty}, Explanation length: ${explanation.length}`);
  if (explanation) {
    console.log(`Explanation preview: "${explanation.substring(0, 100)}..."`);
  } else {
    console.log(`WARNING: No explanation found for question "${dbQuestion.text.substring(0, 50)}..."`);
  }
  
  return {
    id: parseInt(dbQuestion.id.slice(0, 8), 16), // Generate a numeric ID from UUID
    text: dbQuestion.text,
    correctAnswer: dbQuestion.correct_answer,
    category: category ? category.name : 'unknown',
    difficulty: dbQuestion.difficulty,
    explanation: explanation, // Pass through the explanation directly
    dbId: dbQuestion.id // Keep the original DB ID for reference
  };
};
