
import { supabase } from "@/integrations/supabase/client";
import type { SavedTestResult } from "@/services/testResultService";
import { toast } from "@/hooks/use-toast";
import { evaluateTestResult, calculateTierForScore } from "@/utils/scoring";
import { fetchQuestions } from "@/services/questionService";

type TestDataConfig = {
  count: number;
  scoreDistribution: 'random' | 'fixed' | 'gaussian';
  usernamePattern: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  minScore: number;
  maxScore: number;
};

type GenerationResult = {
  count: number;
  results: SavedTestResult[];
};

/**
 * Generates a random score within the configured range
 */
const generateScore = (config: TestDataConfig): { 
  score: number; 
  maxScore: number; 
  percentage: number; 
} => {
  const maxPossibleScore = 100; // Fixed value for simplicity, could be dynamic
  let score: number;
  
  switch (config.scoreDistribution) {
    case 'fixed':
      // Generate a score in the middle of the range
      score = Math.floor((config.minScore + config.maxScore) / 2);
      break;
    
    case 'gaussian':
      // Generate a bell curve distribution
      const mean = (config.minScore + config.maxScore) / 2;
      const stdDev = (config.maxScore - config.minScore) / 6; // ~99.7% of values within range
      
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      score = Math.round(mean + z0 * stdDev);
      // Clamp to range
      score = Math.max(config.minScore, Math.min(config.maxScore, score));
      break;
    
    case 'random':
    default:
      // Generate a random score within the range
      score = Math.floor(Math.random() * (config.maxScore - config.minScore + 1)) + config.minScore;
  }
  
  const percentage = (score / maxPossibleScore) * 100;
  
  return { 
    score, 
    maxScore: maxPossibleScore, 
    percentage 
  };
};

/**
 * Generates a random date within the configured range
 */
const generateDate = (config: TestDataConfig): string => {
  const startTime = config.dateRange.start.getTime();
  const endTime = config.dateRange.end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  
  return new Date(randomTime).toISOString();
};

/**
 * Generates category scores for a test result
 */
const generateCategoryScores = (totalScore: number): Record<string, number> => {
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

/**
 * Generates mock test data based on the provided configuration
 */
export const generateTestData = async (config: TestDataConfig): Promise<GenerationResult> => {
  const results: SavedTestResult[] = [];
  
  try {
    // Fetch real questions to use for the test snapshot
    const questions = await fetchQuestions();
    
    for (let i = 0; i < config.count; i++) {
      const username = `${config.usernamePattern}${i + 1}`;
      const { score, maxScore, percentage } = generateScore(config);
      const tier = calculateTierForScore(percentage);
      const categoryScores = generateCategoryScores(score);
      const createdAt = generateDate(config);
      
      // Create a snapshot of questions for this test
      const questionsSnapshot = questions.slice(0, Math.min(20, questions.length));
      
      // Insert the test result into the database
      const { data, error } = await supabase
        .from('test_results')
        .insert({
          username,
          overall_score: score,
          max_possible_score: maxScore,
          percentage_score: percentage,
          tier_name: tier.name,
          category_scores: categoryScores,
          created_at: createdAt,
          is_test_data: true,
          public: true,
          questions_snapshot: questionsSnapshot
        })
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating test result ${i}:`, error);
        continue;
      }
      
      results.push(data);
    }
    
    return {
      count: results.length,
      results
    };
  } catch (error) {
    console.error("Error generating test data:", error);
    throw new Error("Failed to generate test data");
  }
};

/**
 * Removes all test data from the database
 */
export const cleanupTestData = async (): Promise<{ count: number }> => {
  try {
    // Delete all test data
    const { error, count } = await supabase
      .from('test_results')
      .delete({ count: 'exact' })
      .eq('is_test_data', true);
    
    if (error) {
      console.error("Error cleaning up test data:", error);
      throw error;
    }
    
    return { count: count || 0 };
  } catch (error) {
    console.error("Error cleaning up test data:", error);
    throw new Error("Failed to clean up test data");
  }
};
