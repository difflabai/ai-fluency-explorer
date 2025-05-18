
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
  difficulty: 'novice' | 'advanced-beginner' | 'competent' | 'proficient' | 'expert';
};

export type UserAnswer = {
  questionId: number;
  answer: boolean;
};

export const categories: Category[] = [
  {
    id: 'novice',
    name: 'Novice',
    description: 'First Steps in AI Fluency'
  },
  {
    id: 'advanced-beginner',
    name: 'Advanced Beginner',
    description: 'Building Competence in AI'
  },
  {
    id: 'competent',
    name: 'Competent',
    description: 'Strategic Implementation of AI'
  },
  {
    id: 'proficient',
    name: 'Proficient',
    description: 'Advanced AI Techniques'
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Innovation and Mastery of AI'
  }
];

export const sampleQuestions: Question[] = [
  // NOVICE LEVEL: First Steps (1-25)
  {
    id: 1,
    text: 'I\'ve used at least three different AI chat tools and can compare their relative strengths',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 2,
    text: 'I regularly edit and personalize AI-generated text rather than using it verbatim',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 3,
    text: 'I\'ve identified specific topics where AI consistently gives me better answers than web searches',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 4,
    text: 'I\'ve experimented with different phrasings of the same question to improve AI responses',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 5,
    text: 'I\'ve asked AI to explain a complex concept in multiple ways until I understood it',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 6,
    text: 'I\'ve used AI to translate not just words but cultural context between languages',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 7,
    text: 'I\'ve caught an AI confidently stating something false and know how to reduce these hallucinations',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 8,
    text: 'I\'ve identified at least three tasks in my regular routine that AI tools help me complete faster',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 9,
    text: 'I know which AI features I\'m willing to pay for versus which free options meet my needs',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 10,
    text: 'I deliberately use AI as a brainstorming partner to generate ideas I wouldn\'t have thought of alone',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 11,
    text: 'I\'ve used AI to summarize long articles and retained the key points',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 12,
    text: 'I understand that tokens are the basic units processed by AI models and impact pricing',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 13,
    text: 'I\'ve asked AI to critique my writing and implemented its suggestions',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 14,
    text: 'I\'ve used AI to convert unstructured information into organized formats (lists, tables, etc.)',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 15,
    text: 'I\'ve asked AI to generate multiple options for a decision I needed to make',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  
  // Adding more novice questions (16-25)
  {
    id: 16,
    text: 'I know that AI can hallucinate false information that sounds plausible and convincing',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 17,
    text: 'I\'ve used AI-generated visuals (images, charts) in my personal or professional projects',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 18,
    text: 'I\'ve compared how different AI tools translate the same text and noted the differences',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 19,
    text: 'I\'ve used AI to simplify technical language for non-expert audiences',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 20,
    text: 'I understand that AI works by predicting text patterns rather than truly reasoning or understanding',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 21,
    text: 'I\'ve used AI as a Dungeon Master or game master to run a tabletop RPG session',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 22,
    text: 'I\'ve had AI explain the rules of a complex board game and answer my questions during gameplay',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 23,
    text: 'I\'ve used AI to generate unique character backstories or NPCs for gaming',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 24,
    text: 'I\'ve created a fantasy sports strategy or draft plan with AI assistance',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 25,
    text: 'I\'ve used AI to suggest and plan themed parties or events with creative elements',
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  
  // ADVANCED BEGINNER LEVEL: Building Competence (26-50)
  {
    id: 26,
    text: 'I\'ve developed a personal set of preferences for how I like AI to format its responses to me',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 27,
    text: 'I\'ve used AI to help me learn a new concept by asking progressively deeper questions',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 28,
    text: 'I\'ve successfully used AI to extract specific information from complex documents',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 29,
    text: 'I\'ve deliberately experimented with AI tools outside my comfort zone to discover new capabilities',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 30,
    text: 'I\'ve scheduled regular AI-powered check-ins for projects or learning goals',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  
  // More Advanced Beginner questions (31-50)
  {
    id: 31,
    text: 'I transform vague instructions into specific, measurable requests with examples of desired outputs',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 32,
    text: 'I intentionally keep my prompts concise while including essential details for quality results',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 33,
    text: 'I create reusable prompt templates with variables that I can swap out for different situations',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 34,
    text: 'I\'ve asked AI to critique its own answers and used that feedback to craft better questions',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 35,
    text: 'I\'ve discovered which visual formats (bullets, tables, etc.) help me absorb AI-generated information best',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 36,
    text: 'I\'ve had AI design a scavenger hunt or puzzle game for friends or family',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 37,
    text: 'I\'ve used AI to create personalized workout routines or training plans',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 38,
    text: 'I\'ve generated travel itineraries with AI that included hidden gems or local experiences',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 39,
    text: 'I\'ve used AI to compose custom birthday messages or poems for loved ones',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 40,
    text: 'I\'ve had AI suggest recipes based on ingredients I already have at home',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  
  // More Advanced Beginner questions (41-50)
  {
    id: 41,
    text: 'I\'ve optimized my prompts to reduce token usage and lower my costs',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 42,
    text: 'I\'ve successfully delegated routine tasks to AI while focusing my time on work that requires human judgment',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 43,
    text: 'I\'ve analyzed how a specific AI implementation could improve processes in my work or personal projects',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 44,
    text: 'I\'ve used AI to prepare for a difficult conversation by role-playing multiple perspectives',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 45,
    text: 'I\'ve generated a creative project (story, art, music) with AI that I was proud to share publicly',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 46,
    text: 'I understand that base models generate text based on patterns while instruction-tuned models are specifically trained to follow directions',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 47,
    text: 'I know that different AI models have varying context window sizes, limiting how much text they can consider at once',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 48,
    text: 'I use role/context instructions in prompts (e.g., "Act as a project coach") to get more appropriate responses',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 49,
    text: 'I\'ve built a personal collection of effective prompts for recurring needs',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 50,
    text: 'I deliberately use "zero-shot" (no examples), "one-shot" (one example), or "few-shot" (multiple examples) prompting depending on the task complexity',
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  
  // COMPETENT LEVEL: Strategic Implementation (51-85) - Adding a sample of these
  {
    id: 51,
    text: 'I\'ve used AI to create custom coloring pages or simple games for children',
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 52,
    text: 'I\'ve generated AI art in a specific style and framed it or displayed it in my home',
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 53,
    text: 'I\'ve used AI to help plan a garden or landscape design for my space',
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 54,
    text: 'I\'ve created a custom trivia game with AI generated questions on topics my friends enjoy',
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 55,
    text: 'I\'ve used AI to generate personalized book or movie recommendations beyond the mainstream',
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  
  // PROFICIENT LEVEL: Advanced Techniques (86-170) - Adding a sample
  {
    id: 86,
    text: 'I know to use AI tools with retrieval when I need up-to-date information and fine-tuning when I need specialized capabilities',
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 87,
    text: 'I understand that embeddings convert text into numerical vectors that capture meaning relationships',
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 88,
    text: 'I know that "grounding" means anchoring AI responses to verified information sources',
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 89,
    text: 'I design prompts that return structured output such as tables or JSON for easier processing',
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 90,
    text: 'I\'ve configured tools that let AI reference my private documents to provide personalized responses',
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  
  // EXPERT LEVEL: Innovation and Mastery (171-240) - Adding a sample
  {
    id: 171,
    text: 'I\'ve developed domain-specific benchmarks to evaluate AI performance for my use cases',
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 172,
    text: 'I\'ve created synthetic training data to overcome limitations in available real-world data',
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 173,
    text: 'I\'ve implemented comprehensive prompt injection protection for production AI systems',
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 174,
    text: 'I\'ve designed AI systems that explicitly show their reasoning and sources',
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 175,
    text: 'I\'ve created AI-powered innovation processes that systematically explore new possibilities',
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
];

// Get a subset of questions for quick assessment (50 questions)
export const getQuickAssessmentQuestions = (): Question[] => {
  const quickAssessmentQuestions = [];
  
  // Get 10 questions from each category to ensure even distribution
  categories.forEach(category => {
    const categoryQuestions = sampleQuestions.filter(q => q.category === category.id);
    const selectedQuestions = categoryQuestions.slice(0, 10); // Take up to 10 questions per category
    quickAssessmentQuestions.push(...selectedQuestions);
  });
  
  // Return up to 50 questions
  return quickAssessmentQuestions.slice(0, 50);
};

// Get all questions for comprehensive assessment
export const getComprehensiveQuestions = (): Question[] => {
  return sampleQuestions;
};
