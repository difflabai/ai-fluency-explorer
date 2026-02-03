import { Question, UserAnswer } from '../testData';
import { Category, categories } from '../testData';
import { CategoryScore } from './types';

// Calculate individual category scores
export const calculateCategoryScores = (
  questions: Question[],
  userAnswers: UserAnswer[]
): CategoryScore[] => {
  const categoryScores: CategoryScore[] = [];

  // First, calculate skill-based category scores using predefined categories
  const skillCategories = [
    'Prompt Engineering',
    'AI Ethics',
    'Technical Concepts',
    'Practical Applications',
  ];

  skillCategories.forEach((skillCategory) => {
    // Find questions that match this skill category by mapping category IDs to names
    const categoryQuestions = questions.filter((q) => {
      // Map category IDs to skill category names
      const categoryMap: Record<string, string> = {
        '1': 'Prompt Engineering',
        '2': 'AI Ethics',
        '3': 'Technical Concepts',
        '4': 'Practical Applications',
      };

      // Check if question category matches either the skill name directly or via ID mapping
      return q.category === skillCategory || categoryMap[q.category] === skillCategory;
    });

    const totalQuestions = categoryQuestions.length;

    if (totalQuestions === 0) {
      // Still add the category with 0 score to maintain consistent chart structure
      categoryScores.push({
        categoryId: skillCategory.toLowerCase().replace(/\s+/g, '-'),
        categoryName: skillCategory,
        score: 0,
        totalQuestions: 0,
        percentage: 0,
      });
      return;
    }

    let categoryScore = 0;
    categoryQuestions.forEach((question) => {
      const userAnswer = userAnswers.find((a) => a.questionId === question.id);
      if (userAnswer && userAnswer.answer === true) {
        categoryScore++;
      }
    });

    const percentage = (categoryScore / totalQuestions) * 100;

    categoryScores.push({
      categoryId: skillCategory.toLowerCase().replace(/\s+/g, '-'),
      categoryName: skillCategory,
      score: categoryScore,
      totalQuestions,
      percentage,
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
    novice: [],
    'advanced-beginner': [],
    competent: [],
    proficient: [],
    expert: [],
  };

  // Populate the groups
  questions.forEach((question) => {
    const difficulty = String(question.difficulty);
    if (questionsByDifficulty[difficulty]) {
      questionsByDifficulty[difficulty].push(question);
    }
  });

  // Calculate scores for each difficulty level
  return Object.entries(questionsByDifficulty).map(
    ([difficulty, difficultyQuestions]) => {
      let score = 0;
      difficultyQuestions.forEach((question) => {
        const userAnswer = userAnswers.find((a) => a.questionId === question.id);
        if (userAnswer && userAnswer.answer === true) {
          score++;
        }
      });

      // Format the difficulty name for display
      let displayName: string;
      switch (difficulty) {
        case 'novice':
          displayName = 'Novice';
          break;
        case 'advanced-beginner':
          displayName = 'Advanced Beginner';
          break;
        case 'competent':
          displayName = 'Competent';
          break;
        case 'proficient':
          displayName = 'Proficient';
          break;
        case 'expert':
          displayName = 'Expert';
          break;
        default:
          displayName = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
      }

      const percentage =
        difficultyQuestions.length > 0 ? (score / difficultyQuestions.length) * 100 : 0;

      return {
        categoryId: difficulty,
        categoryName: displayName,
        score: score,
        totalQuestions: difficultyQuestions.length,
        percentage,
      };
    }
  );
};
