
export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Question = {
  id: number;
  text: string;
  correctAnswer: boolean;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export type UserAnswer = {
  questionId: number;
  answer: boolean;
};

export const categories: Category[] = [
  {
    id: 'basic',
    name: 'Basic Understanding',
    description: 'Core concepts and foundational knowledge about AI technologies'
  },
  {
    id: 'prompt',
    name: 'Prompt Engineering',
    description: 'Skills for effectively communicating with AI systems'
  },
  {
    id: 'technical',
    name: 'Technical Knowledge',
    description: 'Understanding of AI architectures, models, and implementations'
  },
  {
    id: 'application',
    name: 'Application Diversity',
    description: 'Knowledge of various AI applications across different domains'
  },
  {
    id: 'ethics',
    name: 'Ethics & Governance',
    description: 'Understanding ethical considerations and governance frameworks'
  },
  {
    id: 'advanced',
    name: 'Advanced Techniques',
    description: 'Sophisticated methods for leveraging AI capabilities'
  }
];

export const sampleQuestions: Question[] = [
  {
    id: 1,
    text: 'Machine learning is a subset of artificial intelligence.',
    correctAnswer: true,
    category: 'basic',
    difficulty: 'easy'
  },
  {
    id: 2, 
    text: 'GPT stands for "General Purpose Technology".',
    correctAnswer: false,
    category: 'basic',
    difficulty: 'easy'
  },
  {
    id: 3,
    text: 'Adding more specific details to a prompt typically results in less accurate AI outputs.',
    correctAnswer: false,
    category: 'prompt',
    difficulty: 'easy'
  },
  {
    id: 4,
    text: 'Chain-of-thought prompting helps AI models with complex reasoning tasks.',
    correctAnswer: true,
    category: 'prompt',
    difficulty: 'medium'
  },
  {
    id: 5,
    text: 'Deep learning models require labeled data for supervised learning.',
    correctAnswer: true,
    category: 'technical',
    difficulty: 'medium'
  },
  {
    id: 6,
    text: 'Transfer learning allows models to apply knowledge from one task to another.',
    correctAnswer: true,
    category: 'technical',
    difficulty: 'medium'
  },
  {
    id: 7,
    text: 'AI can only be used for text and image processing tasks.',
    correctAnswer: false,
    category: 'application',
    difficulty: 'easy'
  },
  {
    id: 8,
    text: 'Recommender systems are an example of AI application in e-commerce.',
    correctAnswer: true,
    category: 'application',
    difficulty: 'easy'
  },
  {
    id: 9,
    text: 'AI models are inherently unbiased since they operate on pure mathematics.',
    correctAnswer: false,
    category: 'ethics',
    difficulty: 'medium'
  },
  {
    id: 10,
    text: 'Explainable AI (XAI) focuses on making AI decisions transparent and understandable.',
    correctAnswer: true,
    category: 'ethics',
    difficulty: 'medium'
  },
  {
    id: 11,
    text: 'Prompt chaining involves using the output of one AI response as input for another prompt.',
    correctAnswer: true,
    category: 'advanced',
    difficulty: 'hard'
  },
  {
    id: 12,
    text: 'Reinforcement learning from human feedback (RLHF) is a technique used to train large language models.',
    correctAnswer: true,
    category: 'advanced',
    difficulty: 'hard'
  },
  {
    id: 13,
    text: 'The Turing Test determines if an AI can perform mathematical calculations accurately.',
    correctAnswer: false,
    category: 'basic',
    difficulty: 'easy'
  },
  {
    id: 14,
    text: 'Transformers are a neural network architecture commonly used in modern language models.',
    correctAnswer: true,
    category: 'technical',
    difficulty: 'hard'
  },
  {
    id: 15,
    text: 'AI-generated content always includes attribution to the original data it was trained on.',
    correctAnswer: false,
    category: 'ethics',
    difficulty: 'medium'
  }
];

// Get a subset of questions for quick assessment (50 questions)
export const getQuickAssessmentQuestions = (): Question[] => {
  // In a real app, this would be more sophisticated to ensure even category coverage
  return sampleQuestions.slice(0, Math.min(sampleQuestions.length, 15));
};

// Get all questions for comprehensive assessment
export const getComprehensiveQuestions = (): Question[] => {
  return sampleQuestions;
};
