
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

export const customQuickAssessmentQuestions: Question[] = [
  {
    id: 1,
    text: "I've used AI to create a personalized bedtime story featuring friends or family members",
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 2,
    text: "I've had AI explain a complex topic using only references from my favorite movie or TV show",
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 3,
    text: "I've used AI to translate not just words but cultural context between languages",
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 4,
    text: "I've caught an AI confidently stating something false and successfully challenged it",
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 5,
    text: "I've used AI as a brainstorming partner to generate ideas I wouldn't have thought of alone",
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 6,
    text: "I've had AI generate a custom workout routine that adapts to my specific needs and limitations",
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 7,
    text: "I've used AI to create a virtual time capsule with predictions about the future",
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 8,
    text: "I've asked AI to help me understand opposing viewpoints on a controversial topic",
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 9,
    text: "I've used AI as a Dungeon Master to run a tabletop RPG session for friends",
    correctAnswer: true,
    category: 'novice',
    difficulty: 'novice'
  },
  {
    id: 10,
    text: "I've generated a creative project with AI that I was proud enough to share publicly",
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 11,
    text: "I transform vague requests into specific, actionable prompts with examples of desired outputs",
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 12,
    text: "I've used AI to prepare for a difficult conversation by role-playing multiple perspectives",
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 13,
    text: "I've had AI design a scavenger hunt with personalized clues based on inside jokes",
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 14,
    text: "I've created a fantasy world or fictional universe with AI assistance",
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 15,
    text: "I've hosted a friendly rap battle between two different AI systems and judged the results",
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 16,
    text: "I've used AI to analyze my writing style and mimic it to maintain consistency in a project",
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 17,
    text: "I've generated travel itineraries with AI that included hidden gems not on typical tourist routes",
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 18,
    text: "I've used different temperature settings to control the creativity versus predictability of AI outputs",
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 19,
    text: "I've used AI to create a custom trivia game with questions tailored to my friends' interests",
    correctAnswer: true,
    category: 'advanced-beginner',
    difficulty: 'advanced-beginner'
  },
  {
    id: 20,
    text: "I've systematically compared multiple AI tools on the same complex task and documented their strengths",
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 21,
    text: "I've developed a consistent \"persona\" for my AI assistant by using specific role instructions",
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 22,
    text: "I've created a personal knowledge base of my best AI interactions that I reference for future needs",
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 23,
    text: "I structure complex prompts with clear sections (Context, Task, Format, Examples, Constraints)",
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 24,
    text: "I've taught AI to generate content in a specific creator's style by providing clear examples",
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 25,
    text: "I've used \"few-shot\" prompting by providing multiple examples to guide AI into producing the output I want",
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 26,
    text: "I've fixed hallucinations by adding specific domain context and knowledge constraints",
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 27,
    text: "I've used AI to design a custom escape room or mystery game with interconnected puzzles",
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 28,
    text: "I've created a fantasy sports strategy by having AI analyze player statistics and trends",
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 29,
    text: "I deliberately use \"chain-of-thought\" prompting to make AI show its reasoning before conclusions",
    correctAnswer: true,
    category: 'competent',
    difficulty: 'competent'
  },
  {
    id: 30,
    text: "I've asked AI to generate personalized learning materials that adapt to my learning style",
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 31,
    text: "I recognize when to use \"Tree-of-Thought\" prompting to explore multiple solution paths simultaneously",
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 32,
    text: "I've built a ReAct-style approach where AI alternates between reasoning and gathering information",
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 33,
    text: "I combine multiple AI outputs in \"ensemble prompting\" to get more reliable or creative results",
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 34,
    text: "I've implemented custom retrieval strategies to bring my personal knowledge into AI conversations",
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 35,
    text: "I use \"context refreshing\" techniques in long conversations to maintain focus on key information",
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 36,
    text: "I've created multi-agent workflows where different specialized AIs collaborate on complex projects",
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 37,
    text: "I've automated meeting notes with AI summaries that integrate directly into my project tools",
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 38,
    text: "I've created workflows that combine text and image AI to generate illustrated content",
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 39,
    text: "I design prompts that return structured data (JSON, tables) for integration with other systems",
    correctAnswer: true,
    category: 'proficient',
    difficulty: 'proficient'
  },
  {
    id: 40,
    text: "I've conducted systematic experiments to determine optimal chunk sizes for processing large documents",
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 41,
    text: "I've designed custom AI agents that perform multi-step tasks across different platforms autonomously",
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 42,
    text: "I've fine-tuned a model to specialize in my domain with carefully curated training examples",
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 43,
    text: "I've created a dashboard that measures the tangible impact of AI tools on my productivity",
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 44,
    text: "I've developed novel prompting techniques that achieve results beyond standard approaches",
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 45,
    text: "I've designed AI systems that explicitly show their reasoning process and cite their sources",
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 46,
    text: "I've built AI workflows that learn from and incorporate diverse perspectives",
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 47,
    text: "I've created AI-powered coaching systems that help people develop specific skills",
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 48,
    text: "I've employed AI as a Socratic questioning partner to identify blindspots in my thinking",
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 49,
    text: "I've designed AI interfaces that optimize for human-AI collaboration rather than just automation",
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
  },
  {
    id: 50,
    text: "I've created a personal roadmap for developing my AI fluency with measurable milestones",
    correctAnswer: true,
    category: 'expert',
    difficulty: 'expert'
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
  // Use the custom questions directly for the quick assessment
  return customQuickAssessmentQuestions;
};

// Get all questions for comprehensive assessment
export const getComprehensiveQuestions = (): Question[] => {
  // Return all 240 questions for the comprehensive assessment
  return sampleQuestions;
};
