
import { CategoryScore } from '@/utils/scoring';

/**
 * Format category scores from the database into a consistent CategoryScore array
 * This replaces the artificial transformation logic with proper data formatting
 */
export const formatCategoryScores = (categoryScores: any): CategoryScore[] => {
  console.log("formatCategoryScores input:", categoryScores);
  console.log("Input type:", typeof categoryScores);
  console.log("Is array:", Array.isArray(categoryScores));
  
  // Handle null or undefined input
  if (!categoryScores) {
    console.log("Category scores is null/undefined, returning empty array");
    return [];
  }
  
  // If it's already a properly formatted array, return it
  if (Array.isArray(categoryScores) && categoryScores.length > 0) {
    // Check if the first item has the expected structure
    const firstItem = categoryScores[0];
    if (firstItem && typeof firstItem === 'object' && 'categoryName' in firstItem) {
      console.log("Category scores already properly formatted");
      return categoryScores as CategoryScore[];
    }
  }
  
  // If it's stored as an object with numeric keys, convert to proper format
  if (categoryScores && typeof categoryScores === 'object' && !Array.isArray(categoryScores)) {
    console.log("Converting object format to CategoryScore array");
    
    const categoryMap: Record<string, string> = {
      "1": "Prompt Engineering",
      "2": "AI Ethics", 
      "3": "Technical Concepts",
      "4": "Practical Applications"
    };
    
    const formattedScores = Object.entries(categoryScores).map(([key, value]: [string, any]) => {
      console.log(`Processing category ${key}:`, value);
      
      let score: number;
      let totalQuestions: number;
      
      if (typeof value === 'number') {
        score = value;
        totalQuestions = 20; // Default assumption
      } else if (typeof value === 'object' && value !== null) {
        score = value.score || 0;
        totalQuestions = value.totalQuestions || 20;
      } else {
        score = 0;
        totalQuestions = 20;
      }
      
      // Ensure score doesn't exceed totalQuestions
      score = Math.min(score, totalQuestions);
      
      // Calculate percentage with proper rounding
      const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
      
      return {
        categoryId: key,
        categoryName: categoryMap[key] || `Category ${key}`,
        score: Math.max(0, score),
        totalQuestions: Math.max(1, totalQuestions),
        percentage: Math.max(0, percentage)
      };
    });
    
    console.log("Formatted scores:", formattedScores);
    return formattedScores;
  }
  
  // If it's an array but not properly formatted, try to convert
  if (Array.isArray(categoryScores) && categoryScores.length > 0) {
    console.log("Converting array format to CategoryScore array");
    
    const categoryNames = ["Prompt Engineering", "AI Ethics", "Technical Concepts", "Practical Applications"];
    
    return categoryScores.map((item, index) => {
      let score: number;
      let totalQuestions: number;
      
      if (typeof item === 'number') {
        score = item;
        totalQuestions = 20;
      } else if (typeof item === 'object' && item !== null) {
        score = item.score || 0;
        totalQuestions = item.totalQuestions || 20;
      } else {
        score = 0;
        totalQuestions = 20;
      }
      
      // Ensure score doesn't exceed totalQuestions
      score = Math.min(score, totalQuestions);
      
      // Calculate percentage with proper rounding
      const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
      
      return {
        categoryId: (index + 1).toString(),
        categoryName: categoryNames[index] || `Category ${index + 1}`,
        score: Math.max(0, score),
        totalQuestions: Math.max(1, totalQuestions),
        percentage: Math.max(0, percentage)
      };
    });
  }
  
  // Return empty array if no valid data can be processed
  console.log("No valid category score data found, returning empty array");
  return [];
};
