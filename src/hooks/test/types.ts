
import { TestResult } from '@/utils/scoring';

export interface Question {
  id: number;
  text: string;
  correctAnswer: boolean;
  category: string;
  difficulty: 'novice' | 'advanced-beginner' | 'competent' | 'proficient' | 'expert';
  explanation?: string;
  dbId?: string; // Database ID for when saving answers
}

export interface UserAnswer {
  questionId: number;
  answer: boolean;
}

export interface UseTestStateProps {
  testType: 'quick' | 'comprehensive';
}

export interface UseTestStateReturn {
  questions: Question[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  userAnswers: UserAnswer[];
  testComplete: boolean;
  result: TestResult | null;
  timeElapsed: number;
  isLoading: boolean;
  handleAnswer: (answer: boolean) => void;
  handleCompleteTest: () => Promise<void>;
  handleSaveProgress: () => void;
  handleNextQuestion: () => void;
  handlePreviousQuestion: () => void;
  currentQuestion: Question | undefined;
  progress: number;
  currentAnswer: boolean | undefined;
  isAnswered: boolean;
  isLastQuestion: boolean;
  unansweredCount: number;
}
