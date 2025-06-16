
import { CategoryScore } from '@/utils/scoring';

/**
 * Format category scores from the database into a consistent CategoryScore array
 * Fixed to handle actual scores without artificial capping
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
      
      let rawScore: number;
      
      if (typeof value === 'number') {
        rawScore = value;
      } else if (typeof value === 'object' && value !== null) {
        rawScore = value.score || 0;
      } else {
        rawScore = 0;
      }
      
      // Use the actual raw score to determine realistic totals
      // Instead of assuming 20 questions per category, calculate based on the score
      const estimatedTotalQuestions = Math.max(rawScore, 20); // Use at least 20 as baseline
      const actualScore = Math.max(0, rawScore);
      
      // Calculate realistic percentage based on actual performance
      const percentage = estimatedTotalQuestions > 0 
        ? Math.round((actualScore / estimatedTotalQuestions) * 100)
        : 0;
      
      console.log(`Category ${key}: rawScore=${rawScore}, estimatedTotal=${estimatedTotalQuestions}, percentage=${percentage}%`);
      
      return {
        categoryId: key,
        categoryName: categoryMap[key] || `Category ${key}`,
        score: actualScore,
        totalQuestions: estimatedTotalQuestions,
        percentage: Math.min(100, percentage) // Cap at 100% but don't artificially reduce scores
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
      let rawScore: number;
      
      if (typeof item === 'number') {
        rawScore = item;
      } else if (typeof item === 'object' && item !== null) {
        rawScore = item.score || 0;
      } else {
        rawScore = 0;
      }
      
      const estimatedTotalQuestions = Math.max(rawScore, 20);
      const actualScore = Math.max(0, rawScore);
      const percentage = estimatedTotalQuestions > 0 
        ? Math.round((actualScore / estimatedTotalQuestions) * 100)
        : 0;
      
      return {
        categoryId: (index + 1).toString(),
        categoryName: categoryNames[index] || `Category ${index + 1}`,
        score: actualScore,
        totalQuestions: estimatedTotalQuestions,
        percentage: Math.min(100, percentage)
      };
    });
  }
  
  console.log("No valid category score data found, returning empty array");
  return [];
};
