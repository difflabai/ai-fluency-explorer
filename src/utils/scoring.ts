
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

export const calculateResults = (
  questions: Question[],
  userAnswers: UserAnswer[]
): TestResult => {
  let correctAnswers = 0;
  
  // Calculate overall score
  userAnswers.forEach(userAnswer => {
    const question = questions.find(q => q.id === userAnswer.questionId);
    if (question && question.correctAnswer === userAnswer.answer) {
      correctAnswers++;
    }
  });
  
  const maxPossibleScore = questions.length;
  const overallScore = correctAnswers;
  const percentageScore = (correctAnswers / maxPossibleScore) * 100;
  
  // Determine tier
  const tier = determineUserTier(overallScore);
  
  // Calculate category scores
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

const determineUserTier = (score: number): FluencyTier => {
  for (const tier of fluencyTiers) {
    if (score >= tier.range[0] && score <= tier.range[1]) {
      return tier;
    }
  }
  return fluencyTiers[0]; // Default to novice if something goes wrong
};

const calculateCategoryScores = (
  questions: Question[],
  userAnswers: UserAnswer[]
): CategoryScore[] => {
  const categoryScores: CategoryScore[] = [];
  
  categories.forEach(category => {
    const categoryQuestions = questions.filter(q => q.category === category.id);
    const totalQuestions = categoryQuestions.length;
    
    if (totalQuestions === 0) return;
    
    let categoryCorrect = 0;
    categoryQuestions.forEach(question => {
      const userAnswer = userAnswers.find(a => a.questionId === question.id);
      if (userAnswer && userAnswer.answer === question.correctAnswer) {
        categoryCorrect++;
      }
    });
    
    const percentage = totalQuestions > 0 ? (categoryCorrect / totalQuestions) * 100 : 0;
    
    categoryScores.push({
      categoryId: category.id,
      categoryName: category.name,
      score: categoryCorrect,
      totalQuestions,
      percentage
    });
  });
  
  return categoryScores;
};
