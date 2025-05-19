
import type { Question } from '../testData';
import quickAssessmentQuestions from './quickAssessmentQuestions';
import sampleQuestions from './sampleQuestions';

/**
 * Returns questions for quick assessment
 */
export function getQuickAssessmentQuestions(): Question[] {
  return quickAssessmentQuestions;
}

/**
 * Returns questions for comprehensive assessment
 */
export function getComprehensiveQuestions(): Question[] {
  // This could combine multiple question sets or filter by difficulty
  return [...quickAssessmentQuestions, ...sampleQuestions];
}
