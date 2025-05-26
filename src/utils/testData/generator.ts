
import { supabase } from "@/integrations/supabase/client";
import type { SavedTestResult } from "@/services/testResultService";
import { toast } from "@/hooks/use-toast";
import { fetchQuestions } from "@/services/questionService";
import { calculateTierForScore } from "@/utils/scoring";
import { generateScore, generateCategoryScores } from "./scoreGenerator";
import { generateDate } from "./dateGenerator";
import { TestDataConfig, GenerationResult } from "./types";

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
      const { score, maxScore, percentage } = generateScore(
        config.minScore, 
        config.maxScore, 
        config.scoreDistribution
      );
      const tier = calculateTierForScore(percentage);
      const categoryScores = generateCategoryScores(score);
      const createdAt = generateDate(config.dateRange.start, config.dateRange.end);
      
      // Create a snapshot of questions for this test
      const questionsSnapshot = questions ? 
        questions.slice(0, Math.min(20, questions.length)).map(q => ({
          id: q.id,
          text: q.text,
          category_id: q.category_id,
          difficulty: q.difficulty
        })) : [];
      
      try {
        // Use the service method which handles authentication properly
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
          console.error(`Error creating test result ${i + 1}:`, error);
          
          // If it's an RLS error, try without user_id (anonymous test data)
          if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
            console.log(`Retrying test result ${i + 1} as anonymous data...`);
            const { data: retryData, error: retryError } = await supabase
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
                questions_snapshot: questionsSnapshot,
                user_id: null // Explicitly set to null for test data
              })
              .select()
              .single();
            
            if (retryError) {
              console.error(`Retry failed for test result ${i + 1}:`, retryError);
              continue;
            }
            
            if (retryData) {
              results.push(retryData);
              console.log(`Successfully created test result ${i + 1} (retry)`);
            }
          }
          continue;
        }
        
        if (data) {
          results.push(data);
          console.log(`Successfully created test result ${i + 1}`);
        }
      } catch (err) {
        console.error(`Unexpected error creating test result ${i + 1}:`, err);
        continue;
      }
    }
    
    console.log(`Generated ${results.length} out of ${config.count} requested test results`);
    
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
    
    console.log(`Cleaned up ${count || 0} test data records`);
    return { count: count || 0 };
  } catch (error) {
    console.error("Error cleaning up test data:", error);
    throw new Error("Failed to clean up test data");
  }
};
