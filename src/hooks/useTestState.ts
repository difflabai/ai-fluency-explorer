
import { useState, useEffect } from 'react';
import { getQuestionsForTest } from '@/services/questionService';
import { calculateResults, TestResult } from '@/utils/scoring';
import { UserAnswer } from '@/utils/testData';
import { saveTestResult } from '@/services/testResultService';
import { toast } from "@/hooks/use-toast";

export interface Question {
  id: number;
  text: string;
  correctAnswer: boolean;
  category: string;
  difficulty: 'novice' | 'advanced-beginner' | 'competent' | 'proficient' | 'expert';
  dbId?: string; // Database ID for when saving answers
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

export const useTestState = ({ testType }: UseTestStateProps): UseTestStateReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [testComplete, setTestComplete] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize test with questions from the database
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const loadedQuestions = await getQuestionsForTest(testType);
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [testType]);
  
  // Timer for the test
  useEffect(() => {
    if (testComplete || isLoading) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testComplete, isLoading]);
  
  // Handle user's answer to current question
  const handleAnswer = (answer: boolean) => {
    const updatedAnswers = [...userAnswers];
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return;
    
    // Find if user already answered this question
    const existingAnswerIndex = updatedAnswers.findIndex(
      a => a.questionId === currentQuestion.id
    );
    
    if (existingAnswerIndex >= 0) {
      // Update existing answer
      updatedAnswers[existingAnswerIndex].answer = answer;
    } else {
      // Add new answer
      updatedAnswers.push({
        questionId: currentQuestion.id,
        answer
      });
    }
    
    setUserAnswers(updatedAnswers);
    
    // Auto-advance to next question after slight delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 800);
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Complete the test and show results
  const handleCompleteTest = async () => {
    const testResult = calculateResults(questions, userAnswers);
    setResult(testResult);
    setTestComplete(true);
    
    // Create an object mapping question IDs to their database IDs
    const questionIdToDbId = new Map<number, string>();
    questions.forEach(q => {
      if (q.dbId) {
        questionIdToDbId.set(q.id, q.dbId);
      }
    });
    
    // Map user answers to include database question IDs
    const answersForDb = userAnswers.map(answer => ({
      questionId: questionIdToDbId.get(answer.questionId) || '',
      answer: answer.answer
    })).filter(a => a.questionId !== '');
    
    try {
      // Save test result to database
      const savedResult = await saveTestResult(
        testResult,
        undefined, // username (optional)
        false, // make public
        {
          questionsSnapshot: questions,
          userAnswers: userAnswers
        }
      );
      
      toast({
        title: "Test Completed!",
        description: "Your results are ready to view.",
      });
    } catch (error) {
      console.error('Error saving test results:', error);
      toast({
        title: "Test Completed",
        description: "Your results are ready, but there was an error saving them to your profile.",
        variant: "destructive"
      });
    }
  };
  
  // Save progress (in a real app, this would store to localStorage or backend)
  const handleSaveProgress = () => {
    console.log('Saving progress:', { userAnswers, currentQuestionIndex });
    toast({
      title: "Progress Saved",
      description: "You can continue later from where you left off.",
    });
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (userAnswers.length / questions.length) * 100;
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion?.id)?.answer;
  const isAnswered = currentAnswer !== undefined;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const unansweredCount = questions.length - userAnswers.length;
  
  return {
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userAnswers,
    testComplete,
    result,
    timeElapsed,
    isLoading,
    handleAnswer,
    handleCompleteTest,
    handleSaveProgress,
    handleNextQuestion,
    handlePreviousQuestion,
    currentQuestion,
    progress,
    currentAnswer,
    isAnswered,
    isLastQuestion,
    unansweredCount
  };
};
