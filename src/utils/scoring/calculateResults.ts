
import { Question, UserAnswer } from '../testData';
import { TestResult } from './types';
import { determineUserTier } from './tierUtils';
import { calculateCategoryScores } from './categoryScoring';

// Calculate results from user's answers
export const calculateResults = (
  questions: Question[],
  userAnswers: UserAnswer[]
): TestResult => {
  let correctAnswers = 0;
  
  // For self-assessment, a "true" answer counts as 1 point
  userAnswers.forEach(userAnswer => {
    if (userAnswer.answer === true) {
      correctAnswers++;
    }
  });
  
  const maxPossibleScore = questions.length;
  const overallScore = correctAnswers;
  const percentageScore = (correctAnswers / maxPossibleScore) * 100;
  
  // Determine tier based on score
  const tier = determineUserTier(overallScore);
  
  // Calculate category scores including fluency levels
  const categoryScores = calculateCategoryScores(questions, userAnswers);
  
  return {
    overallScore,
    maxPossibleScore,
    percentageScore,
    tier,
    categoryScores,
    timestamp: new Date()
  };
};
