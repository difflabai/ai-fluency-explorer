
import { supabase } from "@/integrations/supabase/client";
import { TestResult } from "@/utils/scoring";

export interface SavedTestResult {
  id: string;
  user_id?: string;
  username?: string;
  overall_score: number;
  max_possible_score: number;
  percentage_score: number;
  tier_name: string;
  category_scores: any;
  created_at: string;
  public: boolean;
  share_id: string;
  questions_snapshot?: any;
  is_test_data?: boolean;
}

// Save test result to Supabase
export const saveTestResult = async (
  result: TestResult,
  username?: string,
  makePublic: boolean = false,
  additionalData?: {
    questionsSnapshot?: any;
    userAnswers?: any;
  }
): Promise<SavedTestResult | null> => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .insert({
        username,
        overall_score: result.overallScore,
        max_possible_score: result.maxPossibleScore,
        percentage_score: result.percentageScore,
        tier_name: result.tier.name,
        category_scores: result.categoryScores,
        public: makePublic,
        questions_snapshot: additionalData?.questionsSnapshot || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving test result:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error saving test result:', error);
    return null;
  }
};

// Fetch leaderboard data with optional filtering
export const fetchLeaderboard = async (
  limit = 20, 
  includeTestData = true
): Promise<SavedTestResult[]> => {
  try {
    let query = supabase
      .from('test_results')
      .select('*')
      .eq('public', true);
    
    // Filter out test data if requested
    if (!includeTestData) {
      query = query.eq('is_test_data', false);
    }
    
    const { data, error } = await query
      .order('overall_score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// Fetch test result by share ID
export const fetchResultByShareId = async (shareId: string): Promise<SavedTestResult | null> => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('share_id', shareId)
      .single();

    if (error) {
      console.error('Error fetching result by share ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching result by share ID:', error);
    return null;
  }
};

// Fetch user's test results
export const fetchUserResults = async (): Promise<SavedTestResult[]> => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user results:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user results:', error);
    return [];
  }
};

// Toggle public status of a result
export const toggleResultPublic = async (id: string, isPublic: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('test_results')
      .update({ public: isPublic })
      .eq('id', id);

    if (error) {
      console.error('Error toggling result public status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error toggling result public status:', error);
    return false;
  }
};

// Fetch user answers for a specific test result
export const fetchUserAnswersForTest = async (testResultId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_answers')
      .select('*, questions(*)')
      .eq('test_result_id', testResultId);
      
    if (error) {
      console.error('Error fetching user answers:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchUserAnswersForTest:', error);
    return [];
  }
};
