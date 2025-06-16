
import { fetchQuestions } from './questionFetchService';
import { fetchCategories } from './categoryService';
import { convertDBQuestionToAppFormat } from './questionConverterService';
import { saveUserAnswers } from './userAnswerService';
import { migrateQuestionsToDatabase } from './migrationService';

// Re-export types for backward compatibility
export type { DBQuestion, DBCategory, DBTestType } from './types/questionTypes';

// Re-export all the functions to maintain API compatibility
export { fetchQuestions } from './questionFetchService';
export { fetchCategories } from './categoryService';
export { convertDBQuestionToAppFormat } from './questionConverterService';
export { saveUserAnswers } from './userAnswerService';
export { migrateQuestionsToDatabase } from './migrationService';

// Enhanced function that provides detailed distribution analysis
export const getQuestionsForTest = async (testType: 'quick' | 'comprehensive') => {
  console.log(`🎯 Getting questions for ${testType} test with balanced distribution...`);
  
  const [dbQuestions, dbCategories] = await Promise.all([
    fetchQuestions(testType),
    fetchCategories()
  ]);
  
  // Create a map of category IDs to categories for faster lookups
  const categoriesMap = new Map();
  dbCategories.forEach(category => {
    categoriesMap.set(category.id, category);
  });
  
  // Convert DB questions to app format
  const convertedQuestions = dbQuestions.map(q => convertDBQuestionToAppFormat(q, categoriesMap));
  
  // Analyze and log the distribution
  analyzeQuestionDistribution(convertedQuestions, testType);
  
  return convertedQuestions;
};

// Helper function to analyze question distribution
const analyzeQuestionDistribution = (questions: any[], testType: string) => {
  console.log(`\n📊 Distribution Analysis for ${testType} test (${questions.length} questions):`);
  
  // Category distribution
  const categoryStats = questions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n🏷️ Category Distribution:');
  Object.entries(categoryStats).forEach(([category, count]) => {
    const percentage = ((count as number) / questions.length * 100).toFixed(1);
    console.log(`  ${category}: ${count} questions (${percentage}%)`);
  });
  
  // Difficulty distribution
  const difficultyStats = questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n⚡ Difficulty Distribution:');
  const difficultyOrder = ['novice', 'advanced-beginner', 'competent', 'proficient', 'expert'];
  difficultyOrder.forEach(difficulty => {
    const count = difficultyStats[difficulty] || 0;
    const percentage = (count / questions.length * 100).toFixed(1);
    console.log(`  ${difficulty}: ${count} questions (${percentage}%)`);
  });
  
  // Cross-tabulation: Category vs Difficulty
  console.log('\n🎯 Category-Difficulty Cross-Distribution:');
  const categories = Object.keys(categoryStats);
  const crossTab = {};
  
  questions.forEach(q => {
    const key = `${q.category}-${q.difficulty}`;
    crossTab[key] = (crossTab[key] || 0) + 1;
  });
  
  categories.forEach(category => {
    console.log(`  ${category}:`);
    difficultyOrder.forEach(difficulty => {
      const key = `${category}-${difficulty}`;
      const count = crossTab[key] || 0;
      if (count > 0) {
        console.log(`    ${difficulty}: ${count}`);
      }
    });
  });
  
  // Explanation coverage
  const questionsWithExplanations = questions.filter(q => q.explanation && q.explanation.trim().length > 0);
  const explanationCoverage = (questionsWithExplanations.length / questions.length * 100).toFixed(1);
  console.log(`\n📝 Explanation Coverage: ${questionsWithExplanations.length}/${questions.length} (${explanationCoverage}%)`);
  
  console.log('\n✅ Distribution analysis complete!\n');
};
