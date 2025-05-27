
import { fetchCategories, DBCategory } from '@/services/questionService';

// Create a mapping from category IDs to category names
export const createCategoryMapping = async (): Promise<Map<string, string>> => {
  const categories = await fetchCategories();
  const categoryMap = new Map<string, string>();
  
  categories.forEach((category: DBCategory) => {
    categoryMap.set(category.id, category.name);
  });
  
  return categoryMap;
};

// Transform questions snapshot with proper category names
export const transformQuestionsWithCategories = async (questionsSnapshot: any[]) => {
  const categoryMap = await createCategoryMapping();
  
  return questionsSnapshot.map((q: any, index: number) => ({
    id: q.id || index,
    text: q.text || '',
    category: q.category_id ? categoryMap.get(q.category_id) || 'Unknown' : (q.category || 'Unknown'),
    difficulty: q.difficulty || 'unknown',
    correctAnswer: q.correct_answer || false
  }));
};
