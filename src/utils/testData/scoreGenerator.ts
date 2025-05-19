
import { calculateTierForScore } from "@/utils/scoring";

type ScoreDistribution = 'random' | 'fixed' | 'gaussian';

/**
 * Generates a random score within the configured range
 */
export const generateScore = (
  minScore: number,
  maxScore: number,
  distribution: ScoreDistribution
): { 
  score: number; 
  maxScore: number; 
  percentage: number; 
} => {
  const maxPossibleScore = 100; // Fixed value for simplicity, could be dynamic
  let score: number;
  
  switch (distribution) {
    case 'fixed':
      // Generate a score in the middle of the range
      score = Math.floor((minScore + maxScore) / 2);
      break;
    
    case 'gaussian':
      // Generate a bell curve distribution
      const mean = (minScore + maxScore) / 2;
      const stdDev = (maxScore - minScore) / 6; // ~99.7% of values within range
      
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      score = Math.round(mean + z0 * stdDev);
      // Clamp to range
      score = Math.max(minScore, Math.min(maxScore, score));
      break;
    
    case 'random':
    default:
      // Generate a random score within the range
      score = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
  }
  
  const percentage = (score / maxPossibleScore) * 100;
  
  return { 
    score, 
    maxScore: maxPossibleScore, 
    percentage 
  };
};

/**
 * Generates category scores for a test result
 */
export const generateCategoryScores = (totalScore: number): Record<string, number> => {
  // Define some common categories
  const categories = [
    { id: "1", name: "Fundamentals" },
    { id: "2", name: "Reasoning" },
    { id: "3", name: "Language" },
    { id: "4", name: "Knowledge" }
  ];
  
  // Distribute the total score among categories
  const result: Record<string, number> = {};
  let remainingScore = totalScore;
  
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    
    if (i === categories.length - 1) {
      // Last category gets whatever is left
      result[category.id] = remainingScore;
    } else {
      // Distribute randomly but ensure we leave some for the rest
      const maxForThisCategory = remainingScore - (categories.length - i - 1);
      const minScore = Math.max(1, Math.floor(remainingScore / (categories.length - i) / 2));
      const score = Math.floor(Math.random() * (maxForThisCategory - minScore + 1)) + minScore;
      
      result[category.id] = score;
      remainingScore -= score;
    }
  }
  
  return result;
};
