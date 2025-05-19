
import { useState, useEffect } from 'react';
import { getQuestionsForTest } from '@/services/questionService';
import { TestResult } from '@/utils/scoring';
import { toast } from "@/hooks/use-toast";
import { Question, UserAnswer, UseTestStateProps, UseTestStateReturn } from './test/types';
import { handleAnswer, handleCompleteTest, handleSaveProgress, handleNavigation } from './test/testHandlers';
import { calculateTestMetrics } from './test/testUtils';

export type { Question, UserAnswer, UseTestStateProps };

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
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // Use utility function to calculate metrics
  const { 
    progress, 
    currentAnswer, 
    isAnswered, 
    isLastQuestion, 
    unansweredCount 
  } = calculateTestMetrics(questions, userAnswers, currentQuestion, currentQuestionIndex);
  
  // Create handler functions with bound state variables
  const handleUserAnswer = (answer: boolean) => 
    handleAnswer(answer, currentQuestionIndex, questions, userAnswers, setUserAnswers, setCurrentQuestionIndex);
  
  const handleUserCompleteTest = () => 
    handleCompleteTest(questions, userAnswers, setResult, setTestComplete);
  
  const handleNextQuestion = () => 
    handleNavigation.next(currentQuestionIndex, questions, setCurrentQuestionIndex);
  
  const handlePreviousQuestion = () => 
    handleNavigation.previous(currentQuestionIndex, setCurrentQuestionIndex);
  
  return {
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userAnswers,
    testComplete,
    result,
    timeElapsed,
    isLoading,
    handleAnswer: handleUserAnswer,
    handleCompleteTest: handleUserCompleteTest,
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
