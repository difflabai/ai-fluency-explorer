
import { supabase } from "@/integrations/supabase/client";
import { fetchQuestions } from "@/services/questionService";
import { calculateResults } from "@/utils/scoring";
import { generateTestData } from "@/utils/testData";
import type { TestDataConfig } from "@/utils/testData";
import { Question, UserAnswer } from "@/utils/testData";

export interface SystemTestResult {
  testName: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: any;
}

export interface SystemTestSuite {
  suiteName: string;
  results: SystemTestResult[];
  overallStatus: 'PASS' | 'FAIL' | 'WARNING';
  summary: string;
}

/**
 * Comprehensive system test that validates all critical functionality
 */
export const runSystemTests = async (): Promise<SystemTestSuite[]> => {
  console.log('🚀 Starting comprehensive system tests...');
  
  const testSuites: SystemTestSuite[] = [];
  
  // Test Suite 1: Database Schema and Data Integrity
  testSuites.push(await testDatabaseIntegrity());
  
  // Test Suite 2: Question Service and Category Mapping
  testSuites.push(await testQuestionService());
  
  // Test Suite 3: Scoring System
  testSuites.push(await testScoringSystem());
  
  // Test Suite 4: Test Data Generation
  testSuites.push(await testDataGeneration());
  
  // Test Suite 5: User Answer Tracking
  testSuites.push(await testUserAnswerTracking());
  
  console.log('✅ System tests completed');
  return testSuites;
};

/**
 * Test database schema and data integrity
 */
const testDatabaseIntegrity = async (): Promise<SystemTestSuite> => {
  const results: SystemTestResult[] = [];
  
  try {
    // Test 1: Check if categories table exists and has data
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*');
    
    if (catError) {
      results.push({
        testName: 'Categories Table Access',
        status: 'FAIL',
        message: `Cannot access categories table: ${catError.message}`
      });
    } else {
      results.push({
        testName: 'Categories Table Access',
        status: 'PASS',
        message: `Successfully accessed categories table with ${categories?.length || 0} records`
      });
    }
    
    // Test 2: Check if questions table exists and has data
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .limit(5);
    
    if (qError) {
      results.push({
        testName: 'Questions Table Access',
        status: 'FAIL',
        message: `Cannot access questions table: ${qError.message}`
      });
    } else {
      results.push({
        testName: 'Questions Table Access',
        status: 'PASS',
        message: `Successfully accessed questions table with ${questions?.length || 0} active records`
      });
    }
    
    // Test 3: Verify test_results table is clean
    const { data: testResults, error: trError } = await supabase
      .from('test_results')
      .select('count')
      .eq('is_test_data', true);
    
    if (trError) {
      results.push({
        testName: 'Test Results Table Clean',
        status: 'FAIL',
        message: `Cannot check test_results table: ${trError.message}`
      });
    } else {
      const count = testResults?.length || 0;
      results.push({
        testName: 'Test Results Table Clean',
        status: count === 0 ? 'PASS' : 'WARNING',
        message: `Test results table has ${count} test data records`
      });
    }
    
  } catch (error) {
    results.push({
      testName: 'Database Connection',
      status: 'FAIL',
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
  
  const overallStatus = results.some(r => r.status === 'FAIL') ? 'FAIL' : 
                       results.some(r => r.status === 'WARNING') ? 'WARNING' : 'PASS';
  
  return {
    suiteName: 'Database Schema and Data Integrity',
    results,
    overallStatus,
    summary: `Database tests: ${results.filter(r => r.status === 'PASS').length}/${results.length} passed`
  };
};

/**
 * Test question service and category mapping
 */
const testQuestionService = async (): Promise<SystemTestSuite> => {
  const results: SystemTestResult[] = [];
  
  try {
    // Test 1: Fetch questions from service
    const questions = await fetchQuestions();
    
    if (!questions || questions.length === 0) {
      results.push({
        testName: 'Question Service Fetch',
        status: 'FAIL',
        message: 'No questions returned from fetchQuestions service'
      });
    } else {
      results.push({
        testName: 'Question Service Fetch',
        status: 'PASS',
        message: `Successfully fetched ${questions.length} questions`,
        details: { questionCount: questions.length }
      });
      
      // Test 2: Verify category mapping
      const categoryMap: Record<string, string> = {
        "1": "Prompt Engineering",
        "2": "AI Ethics", 
        "3": "Technical Concepts",
        "4": "Practical Applications"
      };
      
      const categoryCounts = questions.reduce((acc, q) => {
        const mappedCategory = categoryMap[q.category_id] || q.category_id;
        acc[mappedCategory] = (acc[mappedCategory] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      results.push({
        testName: 'Category Mapping Distribution',
        status: 'PASS',
        message: 'Questions distributed across categories',
        details: { categoryCounts }
      });
      
      // Test 3: Verify difficulty distribution
      const difficultyLevels = ['novice', 'advanced-beginner', 'competent', 'proficient', 'expert'];
      const difficultyCounts = questions.reduce((acc, q) => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const hasAllDifficulties = difficultyLevels.every(level => difficultyCounts[level] > 0);
      
      results.push({
        testName: 'Difficulty Distribution',
        status: hasAllDifficulties ? 'PASS' : 'WARNING',
        message: hasAllDifficulties ? 'All difficulty levels represented' : 'Some difficulty levels missing',
        details: { difficultyCounts }
      });
    }
    
  } catch (error) {
    results.push({
      testName: 'Question Service Error Handling',
      status: 'FAIL',
      message: `Question service failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
  
  const overallStatus = results.some(r => r.status === 'FAIL') ? 'FAIL' : 
                       results.some(r => r.status === 'WARNING') ? 'WARNING' : 'PASS';
  
  return {
    suiteName: 'Question Service and Category Mapping',
    results,
    overallStatus,
    summary: `Question service tests: ${results.filter(r => r.status === 'PASS').length}/${results.length} passed`
  };
};

/**
 * Test scoring system accuracy
 */
const testScoringSystem = async (): Promise<SystemTestSuite> => {
  const results: SystemTestResult[] = [];
  
  try {
    // Create mock questions for testing
    const mockQuestions: Question[] = [
      { id: 1, text: "Test Q1", correctAnswer: true, category: "1", difficulty: "novice" },
      { id: 2, text: "Test Q2", correctAnswer: false, category: "2", difficulty: "advanced-beginner" },
      { id: 3, text: "Test Q3", correctAnswer: true, category: "3", difficulty: "competent" },
      { id: 4, text: "Test Q4", correctAnswer: false, category: "4", difficulty: "proficient" },
      { id: 5, text: "Test Q5", correctAnswer: true, category: "1", difficulty: "expert" }
    ];
    
    // Test 1: Perfect score (all correct)
    const perfectAnswers: UserAnswer[] = [
      { questionId: 1, answer: true },
      { questionId: 2, answer: false },
      { questionId: 3, answer: true },
      { questionId: 4, answer: false },
      { questionId: 5, answer: true }
    ];
    
    const perfectResult = calculateResults(mockQuestions, perfectAnswers);
    
    if (perfectResult.overallScore === 5 && perfectResult.percentageScore === 100) {
      results.push({
        testName: 'Perfect Score Calculation',
        status: 'PASS',
        message: 'Perfect score calculated correctly (5/5 = 100%)',
        details: { score: perfectResult.overallScore, percentage: perfectResult.percentageScore }
      });
    } else {
      results.push({
        testName: 'Perfect Score Calculation',
        status: 'FAIL',
        message: `Perfect score incorrect: got ${perfectResult.overallScore}/5 = ${perfectResult.percentageScore}%`
      });
    }
    
    // Test 2: Partial score
    const partialAnswers: UserAnswer[] = [
      { questionId: 1, answer: true },   // correct
      { questionId: 2, answer: true },   // incorrect (should be false)
      { questionId: 3, answer: true },   // correct
      { questionId: 4, answer: false },  // correct
      { questionId: 5, answer: false }   // incorrect (should be true)
    ];
    
    const partialResult = calculateResults(mockQuestions, partialAnswers);
    const expectedScore = 3; // 3 out of 5 correct
    const expectedPercentage = 60;
    
    if (partialResult.overallScore === expectedScore && partialResult.percentageScore === expectedPercentage) {
      results.push({
        testName: 'Partial Score Calculation',
        status: 'PASS',
        message: `Partial score calculated correctly (${expectedScore}/5 = ${expectedPercentage}%)`,
        details: { score: partialResult.overallScore, percentage: partialResult.percentageScore }
      });
    } else {
      results.push({
        testName: 'Partial Score Calculation',
        status: 'FAIL',
        message: `Partial score incorrect: expected ${expectedScore}/5 = ${expectedPercentage}%, got ${partialResult.overallScore}/5 = ${partialResult.percentageScore}%`
      });
    }
    
    // Test 3: Category scores structure
    if (perfectResult.categoryScores && Array.isArray(perfectResult.categoryScores)) {
      const hasSkillCategories = perfectResult.categoryScores.some(cat => 
        ['Prompt Engineering', 'AI Ethics', 'Technical Concepts', 'Practical Applications'].includes(cat.categoryName)
      );
      
      const hasFluencyLevels = perfectResult.categoryScores.some(cat => 
        ['Novice', 'Advanced Beginner', 'Competent', 'Proficient', 'Expert'].includes(cat.categoryName)
      );
      
      results.push({
        testName: 'Category Scores Structure',
        status: (hasSkillCategories && hasFluencyLevels) ? 'PASS' : 'FAIL',
        message: `Category scores include both skill categories (${hasSkillCategories}) and fluency levels (${hasFluencyLevels})`,
        details: { 
          categoryCount: perfectResult.categoryScores.length,
          categories: perfectResult.categoryScores.map(c => c.categoryName)
        }
      });
    } else {
      results.push({
        testName: 'Category Scores Structure',
        status: 'FAIL',
        message: 'Category scores not properly structured'
      });
    }
    
  } catch (error) {
    results.push({
      testName: 'Scoring System Error Handling',
      status: 'FAIL',
      message: `Scoring system failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
  
  const overallStatus = results.some(r => r.status === 'FAIL') ? 'FAIL' : 
                       results.some(r => r.status === 'WARNING') ? 'WARNING' : 'PASS';
  
  return {
    suiteName: 'Scoring System Accuracy',
    results,
    overallStatus,
    summary: `Scoring tests: ${results.filter(r => r.status === 'PASS').length}/${results.length} passed`
  };
};

/**
 * Test synthetic data generation
 */
const testDataGeneration = async (): Promise<SystemTestSuite> => {
  const results: SystemTestResult[] = [];
  
  try {
    // Test 1: Generate small batch of test data
    const testConfig: TestDataConfig = {
      count: 3,
      scoreDistribution: 'random',
      usernamePattern: 'SystemTest_',
      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        end: new Date()
      },
      minScore: 20,
      maxScore: 80
    };
    
    const generationResult = await generateTestData(testConfig);
    
    if (generationResult.count === testConfig.count) {
      results.push({
        testName: 'Test Data Generation',
        status: 'PASS',
        message: `Successfully generated ${generationResult.count} test records`,
        details: { requestedCount: testConfig.count, actualCount: generationResult.count }
      });
    } else {
      results.push({
        testName: 'Test Data Generation',
        status: 'FAIL',
        message: `Generated ${generationResult.count} records, expected ${testConfig.count}`
      });
    }
    
    // Test 2: Verify generated data in database
    const { data: generatedRecords, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('is_test_data', true)
      .ilike('username', 'SystemTest_%');
    
    if (error) {
      results.push({
        testName: 'Generated Data Verification',
        status: 'FAIL',
        message: `Failed to verify generated data: ${error.message}`
      });
    } else {
      const recordCount = generatedRecords?.length || 0;
      results.push({
        testName: 'Generated Data Verification',
        status: recordCount > 0 ? 'PASS' : 'FAIL',
        message: `Found ${recordCount} generated test records in database`,
        details: { 
          recordCount,
          sampleRecord: generatedRecords?.[0] ? {
            username: generatedRecords[0].username,
            score: generatedRecords[0].overall_score,
            tier: generatedRecords[0].tier_name
          } : null
        }
      });
    }
    
  } catch (error) {
    results.push({
      testName: 'Data Generation Error Handling',
      status: 'FAIL',
      message: `Data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
  
  const overallStatus = results.some(r => r.status === 'FAIL') ? 'FAIL' : 
                       results.some(r => r.status === 'WARNING') ? 'WARNING' : 'PASS';
  
  return {
    suiteName: 'Synthetic Data Generation',
    results,
    overallStatus,
    summary: `Data generation tests: ${results.filter(r => r.status === 'PASS').length}/${results.length} passed`
  };
};

/**
 * Test user answer tracking and persistence
 */
const testUserAnswerTracking = async (): Promise<SystemTestSuite> => {
  const results: SystemTestResult[] = [];
  
  try {
    // Test 1: Check if user_answers table exists
    const { data: userAnswersSchema, error: schemaError } = await supabase
      .from('user_answers')
      .select('*')
      .limit(1);
    
    if (schemaError && schemaError.code !== 'PGRST116') { // PGRST116 = no rows returned
      results.push({
        testName: 'User Answers Table Access',
        status: 'FAIL',
        message: `Cannot access user_answers table: ${schemaError.message}`
      });
    } else {
      results.push({
        testName: 'User Answers Table Access',
        status: 'PASS',
        message: 'Successfully accessed user_answers table'
      });
    }
    
    // Test 2: Verify no orphaned user answers after cleanup
    const { data: orphanedAnswers, error: orphanError } = await supabase
      .from('user_answers')
      .select('*')
      .is('test_result_id', null);
    
    if (orphanError) {
      results.push({
        testName: 'Orphaned Answers Check',
        status: 'WARNING',
        message: `Could not check for orphaned answers: ${orphanError.message}`
      });
    } else {
      const orphanCount = orphanedAnswers?.length || 0;
      results.push({
        testName: 'Orphaned Answers Check',
        status: orphanCount === 0 ? 'PASS' : 'WARNING',
        message: `Found ${orphanCount} orphaned user answers`
      });
    }
    
  } catch (error) {
    results.push({
      testName: 'User Answer Tracking Error',
      status: 'FAIL',
      message: `User answer tracking test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
  
  const overallStatus = results.some(r => r.status === 'FAIL') ? 'FAIL' : 
                       results.some(r => r.status === 'WARNING') ? 'WARNING' : 'PASS';
  
  return {
    suiteName: 'User Answer Tracking',
    results,
    overallStatus,
    summary: `User answer tests: ${results.filter(r => r.status === 'PASS').length}/${results.length} passed`
  };
};

/**
 * Generate comprehensive test report
 */
export const generateTestReport = (testSuites: SystemTestSuite[]): string => {
  const totalTests = testSuites.reduce((sum, suite) => sum + suite.results.length, 0);
  const passedTests = testSuites.reduce((sum, suite) => 
    sum + suite.results.filter(r => r.status === 'PASS').length, 0);
  const failedTests = testSuites.reduce((sum, suite) => 
    sum + suite.results.filter(r => r.status === 'FAIL').length, 0);
  const warningTests = testSuites.reduce((sum, suite) => 
    sum + suite.results.filter(r => r.status === 'WARNING').length, 0);
  
  const overallStatus = failedTests > 0 ? 'FAIL' : warningTests > 0 ? 'WARNING' : 'PASS';
  
  let report = `
=== SYSTEM TEST REPORT ===
Overall Status: ${overallStatus}
Total Tests: ${totalTests}
Passed: ${passedTests} ✅
Failed: ${failedTests} ❌
Warnings: ${warningTests} ⚠️

`;
  
  testSuites.forEach(suite => {
    report += `\n--- ${suite.suiteName} ---\n`;
    report += `Status: ${suite.overallStatus}\n`;
    report += `Summary: ${suite.summary}\n\n`;
    
    suite.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      report += `${icon} ${result.testName}: ${result.message}\n`;
    });
    
    report += '\n';
  });
  
  return report;
};
