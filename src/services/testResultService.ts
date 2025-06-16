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

export interface PaginatedLeaderboardResponse {
  data: SavedTestResult[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface SortOptions {
  field: 'rank' | 'username' | 'score' | 'tier' | 'date';
  direction: 'asc' | 'desc';
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

// Fetch leaderboard data with pagination and weighted ranking support
export const fetchLeaderboard = async (
  limit = 20, 
  includeTestData = true,
  useWeightedRanking = false
): Promise<SavedTestResult[]> => {
  try {
    console.log("🔍 fetchLeaderboard called with:", { limit, includeTestData, useWeightedRanking });
    
    let query = supabase
      .from('test_results')
      .select('*')
      .eq('public', true);
    
    console.log("🔍 Base query created for public results");
    
    // Filter out test data if requested
    if (!includeTestData) {
      console.log("🔍 Filtering out test data");
      query = query.eq('is_test_data', false);
    } else {
      console.log("🔍 Including test data in results");
    }
    
    let { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching leaderboard:', error);
      return [];
    }

    console.log("✅ Leaderboard query successful, returned:", data?.length || 0, "records");
    
    if (!data) return [];

    // Apply weighted ranking if requested
    if (useWeightedRanking) {
      console.log("🔍 Applying weighted ranking");
      
      // Calculate weighted score: percentage_score * max_possible_score
      data = data.map(entry => ({
        ...entry,
        weighted_score: (entry.percentage_score / 100) * entry.max_possible_score
      }));
      
      // Sort by weighted score (highest first)
      data.sort((a, b) => (b as any).weighted_score - (a as any).weighted_score);
    } else {
      // Default sort by created_at (newest first)
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    // Apply limit
    const limitedData = data.slice(0, limit);
    
    console.log("🔍 Final data after sorting and limiting:", limitedData.length, "records");
    
    // Additional debugging for test data
    if (limitedData.length > 0) {
      const testDataRecords = limitedData.filter(item => item.is_test_data);
      console.log("🔍 Test data records in response:", testDataRecords.length);
      
      const todayRecords = limitedData.filter(item => {
        const today = new Date().toISOString().split('T')[0];
        return item.created_at.startsWith(today);
      });
      console.log("🔍 Today's records in response:", todayRecords.length);
      
      // Show the top 3 records for debugging
      const top3 = limitedData.slice(0, 3);
      console.log("🔍 Top 3 records:", top3.map(item => ({
        username: item.username,
        overall_score: item.overall_score,
        max_possible_score: item.max_possible_score,
        percentage_score: item.percentage_score,
        weighted_score: useWeightedRanking ? (item as any).weighted_score : 'N/A',
        created_at: item.created_at,
        is_test_data: item.is_test_data
      })));
    }

    return limitedData;
  } catch (error) {
    console.error('❌ Error fetching leaderboard:', error);
    return [];
  }
};

// Fetch paginated leaderboard data with sorting
export const fetchPaginatedLeaderboard = async (
  page = 1,
  pageSize = 20,
  includeTestData = true,
  sortOptions: SortOptions = { field: 'rank', direction: 'asc' }
): Promise<PaginatedLeaderboardResponse> => {
  try {
    console.log("🔍 fetchPaginatedLeaderboard called with:", { page, pageSize, includeTestData, sortOptions });
    
    let baseQuery = supabase
      .from('test_results')
      .select('*', { count: 'exact' })
      .eq('public', true);
    
    // Filter out test data if requested
    if (!includeTestData) {
      baseQuery = baseQuery.eq('is_test_data', false);
    }
    
    // Apply sorting based on the sort options
    switch (sortOptions.field) {
      case 'rank':
      case 'score':
        // For rank/score, we want to sort by overall_score (higher score = better rank)
        baseQuery = baseQuery.order('overall_score', { ascending: sortOptions.direction === 'asc' });
        // Secondary sort by date for tie-breaking
        baseQuery = baseQuery.order('created_at', { ascending: false });
        break;
      case 'username':
        baseQuery = baseQuery.order('username', { ascending: sortOptions.direction === 'asc' });
        break;
      case 'tier':
        // For tier sorting, we need to handle the tier names properly
        // Since we can't easily sort by tier hierarchy in SQL, we'll sort by overall_score as a proxy
        baseQuery = baseQuery.order('overall_score', { ascending: sortOptions.direction === 'asc' });
        break;
      case 'date':
        baseQuery = baseQuery.order('created_at', { ascending: sortOptions.direction === 'asc' });
        break;
      default:
        // Default to score-based ranking
        baseQuery = baseQuery.order('overall_score', { ascending: false });
        baseQuery = baseQuery.order('created_at', { ascending: false });
    }
    
    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;
    
    const { data, error, count } = await baseQuery
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error('❌ Error fetching paginated leaderboard:', error);
      return {
        data: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
        pageSize
      };
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    console.log("✅ Paginated leaderboard query successful:", {
      records: data?.length || 0,
      totalCount,
      totalPages,
      currentPage: page,
      sortField: sortOptions.field,
      sortDirection: sortOptions.direction
    });

    return {
      data: data || [],
      totalCount,
      totalPages,
      currentPage: page,
      pageSize
    };
  } catch (error) {
    console.error('❌ Error fetching paginated leaderboard:', error);
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
      pageSize
    };
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
