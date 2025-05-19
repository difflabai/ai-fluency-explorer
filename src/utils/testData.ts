
// Central export file for test data utilities
import { generateTestData, cleanupTestData } from './testData/generator';
import type { TestDataConfig, GenerationResult } from './testData/types';

// Re-export all necessary functions and types
export { 
  generateTestData, 
  cleanupTestData 
};

export type { 
  TestDataConfig,
  GenerationResult 
};

// Also export the categories, questions, etc. that were previously in this file
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

// Export the question data and functions
export { customQuickAssessmentQuestions, sampleQuestions, getQuickAssessmentQuestions, getComprehensiveQuestions } from './testData';
