
import { CategoryScore } from '@/utils/scoring';

/**
 * Format category scores from the database into a consistent CategoryScore array
 * This replaces the artificial transformation logic with proper data formatting
 */
export const formatCategoryScores = (categoryScores: any): CategoryScore[] => {
  console.log("Formatting category scores:", categoryScores);
  
  // If it's already a properly formatted array, return it
  if (Array.isArray(categoryScores) && categoryScores.length > 0 && categoryScores[0].categoryName) {
    return categoryScores as CategoryScore[];
  }
  
  // If it's stored as an object with numeric keys, convert to proper format
  if (categoryScores && typeof categoryScores === 'object' && !Array.isArray(categoryScores)) {
    const categoryMap: Record<string, string> = {
      "1": "Prompt Engineering",
      "2": "AI Ethics", 
      "3": "Technical Concepts",
      "4": "Practical Applications"
    };
    
    return Object.entries(categoryScores).map(([key, value]: [string, any]) => {
      const score = typeof value === 'number' ? value : (value.score || 0);
      const totalQuestions = typeof value === 'object' && value.totalQuestions ? value.totalQuestions : 20;
      const percentage = (score / totalQuestions) * 100;
      
      return {
        categoryId: key,
        categoryName: categoryMap[key] || `Category ${key}`,
        score: score,
        totalQuestions: totalQuestions,
        percentage: Math.min(100, Math.max(0, percentage))
      };
    });
  }
  
  // Return empty array if no valid data
  return [];
};
