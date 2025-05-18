
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type CheckResult = {
  success: boolean;
  message: string;
  details?: any;
};

export async function runSystemCheck(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  
  // Start system check
  console.log("🔍 Starting system check...");
  
  // Check 1: Verify DB Connection
  try {
    const { data, error } = await supabase.from('categories').select('*').limit(1);
    if (error) throw error;
    
    results.push({
      success: true,
      message: "✅ Database connection successful"
    });
  } catch (error) {
    results.push({
      success: false,
      message: "❌ Database connection failed",
      details: error
    });
    // Early return if DB connection fails
    return results;
  }
  
  // Check 2: Verify required tables exist
  const requiredTables = ['categories', 'questions', 'test_results', 'user_answers', 'test_types', 'test_questions_map'] as const;
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      // Get the count of records separately
      const { count, error: countError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      results.push({
        success: true,
        message: `✅ Table '${table}' exists with ${count || 0} records`,
        details: { count }
      });
    } catch (error) {
      results.push({
        success: false,
        message: `❌ Table '${table}' check failed`,
        details: error
      });
    }
  }
  
  // Check 3: Verify categories and questions
  try {
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*');
    
    if (catError) throw catError;
    
    if (categories && categories.length > 0) {
      // Check for questions in each category
      const categoryDistribution: Record<string, number> = {};
      
      for (const category of categories) {
        const { count, error: countError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id);
          
        if (countError) throw countError;
        
        categoryDistribution[category.name] = count || 0;
      }
      
      results.push({
        success: true,
        message: `✅ Found ${categories.length} categories with questions distribution`,
        details: categoryDistribution
      });
    } else {
      results.push({
        success: false,
        message: "❌ No categories found in database",
      });
    }
  } catch (error) {
    results.push({
      success: false,
      message: "❌ Categories check failed",
      details: error
    });
  }
  
  // Check 4: Test types and question mappings
  try {
    const { data: testTypes, error: testTypesError } = await supabase
      .from('test_types')
      .select('*');
      
    if (testTypesError) throw testTypesError;
    
    if (testTypes && testTypes.length > 0) {
      const testTypesDistribution: Record<string, number> = {};
      
      // Check question mappings for each test type
      for (const testType of testTypes) {
        const { count, error: countError } = await supabase
          .from('test_questions_map')
          .select('*', { count: 'exact', head: true })
          .eq('test_type_id', testType.id);
          
        if (countError) throw countError;
        
        testTypesDistribution[testType.name] = count || 0;
      }
      
      results.push({
        success: true,
        message: `✅ Found ${testTypes.length} test types with question mappings`,
        details: testTypesDistribution
      });
    } else {
      results.push({
        success: false,
        message: "❌ No test types found in database",
      });
    }
  } catch (error) {
    results.push({
      success: false,
      message: "❌ Test types check failed",
      details: error
    });
  }
  
  // Check 5: Test results and user answers relationship
  try {
    const { data: testResults, error: testError } = await supabase
      .from('test_results')
      .select('id')
      .limit(1);
    
    if (testError) throw testError;
    
    if (testResults && testResults.length > 0) {
      const testResultId = testResults[0].id;
      
      // Check for related user answers
      const { count, error: answerError } = await supabase
        .from('user_answers')
        .select('*', { count: 'exact', head: true })
        .eq('test_result_id', testResultId);
      
      if (answerError) throw answerError;
      
      results.push({
        success: true,
        message: `✅ Test results and user answers relationship verified`,
        details: { 
          testResultId,
          userAnswersCount: count || 0
        }
      });
    } else {
      results.push({
        success: true,
        message: "ℹ️ No test results found (expected for new system)",
      });
    }
  } catch (error) {
    results.push({
      success: false,
      message: "❌ Test results check failed",
      details: error
    });
  }
  
  // Final summary
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  
  console.log(`System check completed: ${successCount} passed, ${failCount} failed`);
  console.table(results.map(r => ({ 
    Status: r.success ? '✅' : '❌',
    Message: r.message
  })));
  
  return results;
}

export async function displaySystemCheck(): Promise<void> {
  try {
    const results = await runSystemCheck();
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    if (failCount === 0) {
      toast({
        title: "System Check Passed",
        description: `All ${successCount} checks completed successfully.`,
      });
    } else {
      toast({
        title: "System Check Issues Found",
        description: `${failCount} issues detected. Check console for details.`,
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Error running system check:", error);
    toast({
      title: "System Check Failed",
      description: "Error running system check. Check console for details.",
      variant: "destructive",
    });
  }
}
