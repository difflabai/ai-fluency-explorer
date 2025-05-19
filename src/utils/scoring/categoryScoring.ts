
import { Question, UserAnswer } from '../testData';
import { Category, categories } from '../testData';
import { CategoryScore } from './types';

// Calculate individual category scores
export const calculateCategoryScores = (
  questions: Question[],
  userAnswers: UserAnswer[]
): CategoryScore[] => {
  // First calculate the original category scores
  const categoryScores: CategoryScore[] = [];
  
  categories.forEach(category => {
    const categoryQuestions = questions.filter(q => q.category === category.id);
    const totalQuestions = categoryQuestions.length;
    
    if (totalQuestions === 0) return;
    
    let categoryScore = 0;
    categoryQuestions.forEach(question => {
      const userAnswer = userAnswers.find(a => a.questionId === question.id);
      // For self-assessment, a "true" answer counts as 1 point
      if (userAnswer && userAnswer.answer === true) {
        categoryScore++;
      }
    });
    
    const percentage = totalQuestions > 0 ? (categoryScore / totalQuestions) * 100 : 0;
    
    categoryScores.push({
      categoryId: category.id,
      categoryName: category.name,
      score: categoryScore,
      totalQuestions,
      percentage
    });
  });
  
  // Calculate fluency level scores based on actual questions
  const fluencyLevelScores = calculateFluencyLevelScores(questions, userAnswers);
  
  return [...categoryScores, ...fluencyLevelScores];
};

// Calculate scores for each fluency level based on actual questions
export const calculateFluencyLevelScores = (
  questions: Question[],
  userAnswers: UserAnswer[]
): CategoryScore[] => {
  // Group questions by difficulty level
  const questionsByDifficulty: Record<string, Question[]> = {
    'novice': [],
    'advanced-beginner': [],
    'competent': [],
    'proficient': [],
    'expert': []
  };
  
  // Populate the groups
  questions.forEach(question => {
    const difficulty = String(question.difficulty);
    if (questionsByDifficulty[difficulty]) {
      questionsByDifficulty[difficulty].push(question);
    }
  });
  
  // Calculate scores for each difficulty level
  return Object.entries(questionsByDifficulty).map(([difficulty, difficultyQuestions]) => {
    let score = 0;
    difficultyQuestions.forEach(question => {
      const userAnswer = userAnswers.find(a => a.questionId === question.id);
      if (userAnswer && userAnswer.answer === true) {
        score++;
      }
    });
    
    // Format the difficulty name for display
    let displayName: string;
    switch(difficulty) {
      case 'novice': displayName = 'Novice'; break;
      case 'advanced-beginner': displayName = 'Advanced Beginner'; break;
      case 'competent': displayName = 'Competent'; break;
      case 'proficient': displayName = 'Proficient'; break;
      case 'expert': displayName = 'Expert'; break;
      default: displayName = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }
    
    return {
      categoryId: difficulty,
      categoryName: displayName,
      score: score,
      totalQuestions: difficultyQuestions.length,
      percentage: difficultyQuestions.length > 0 ? (score / difficultyQuestions.length) * 100 : 0
    };
  });
};
