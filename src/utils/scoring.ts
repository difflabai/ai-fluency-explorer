import { Question, UserAnswer, Category, categories } from './testData';

export type FluencyTier = {
  name: string;
  range: [number, number];
  description: string;
  color: string;
};

export const fluencyTiers: FluencyTier[] = [
  {
    name: 'Novice',
    range: [0, 36],
    description: 'Just starting your AI journey with basic awareness of concepts.',
    color: 'bg-gray-300'
  },
  {
    name: 'Advanced Beginner',
    range: [37, 72],
    description: 'Growing understanding of core AI concepts and applications.',
    color: 'bg-blue-300'
  },
  {
    name: 'Competent',
    range: [73, 120],
    description: 'Solid grasp of AI fundamentals with practical application skills.',
    color: 'bg-green-400'
  },
  {
    name: 'Proficient',
    range: [121, 168],
    description: 'Advanced understanding with specialized knowledge in multiple areas.',
    color: 'bg-ai-purple'
  },
  {
    name: 'Expert',
    range: [169, 240],
    description: 'Comprehensive mastery of AI concepts, applications, and emerging trends.',
    color: 'bg-purple-600'
  }
];

export type CategoryScore = {
  categoryId: string;
  categoryName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
};

export type TestResult = {
  overallScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  tier: FluencyTier;
  categoryScores: CategoryScore[];
  timestamp: Date;
};

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

// Determine user tier based on score
const determineUserTier = (score: number): FluencyTier => {
  for (const tier of fluencyTiers) {
    if (score >= tier.range[0] && score <= tier.range[1]) {
      return tier;
    }
  }
  return fluencyTiers[0]; // Default to novice if something goes wrong
};

// Calculate individual category scores
const calculateCategoryScores = (
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
const calculateFluencyLevelScores = (
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

/**
 * Determines tier based on percentage score
 */
export const calculateTierForScore = (percentageScore: number): FluencyTier => {
  // Convert percentage to absolute score range
  const score = (percentageScore / 100) * 240;
  
  for (const tier of fluencyTiers) {
    if (score >= tier.range[0] && score <= tier.range[1]) {
      return tier;
    }
  }
  
  return fluencyTiers[0]; // Default to novice if something goes wrong
};
