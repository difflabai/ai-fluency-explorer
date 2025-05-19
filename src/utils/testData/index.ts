
// Re-export all necessary functions and types from their respective files
export { generateTestData, cleanupTestData } from './generator';
export type { TestDataConfig, GenerationResult } from './types';

// Export question-related functions and data
export { default as customQuickAssessmentQuestions } from './quickAssessmentQuestions';
export { default as sampleQuestions } from './sampleQuestions';
export { getQuickAssessmentQuestions, getComprehensiveQuestions } from './questionSelectors';

// Export any other utility functions or data that might be needed
export * from './dateGenerator';
export * from './scoreGenerator';
