
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
 * Uses the current authenticated admin user's context
 */
export const generateTestData = async (config: TestDataConfig): Promise<GenerationResult> => {
  const results: SavedTestResult[] = [];
  
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("Authentication required to generate test data");
    }
    
    console.log(`Generating test data as authenticated user: ${user.email}`);
    
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
        // Insert test data using the authenticated admin user's context
        const { data, error } = await supabase
          .from('test_results')
          .insert({
            user_id: user.id, // Use the authenticated admin user's ID
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
 * Uses the current authenticated admin user's context
 */
export const cleanupTestData = async (): Promise<{ count: number }> => {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("Authentication required to cleanup test data");
    }
    
    console.log(`Cleaning up test data as authenticated user: ${user.email}`);
    
    // Delete all test data created by this admin user
    const { error, count } = await supabase
      .from('test_results')
      .delete({ count: 'exact' })
      .eq('is_test_data', true)
      .eq('user_id', user.id);
    
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
