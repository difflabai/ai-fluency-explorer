import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import { Question, UserAnswer, getQuickAssessmentQuestions, getComprehensiveQuestions } from '@/utils/testData';
import { calculateResults, TestResult } from '@/utils/scoring';
import ResultsDashboard from './ResultsDashboard';
import { Save, Timer, ChevronLeft, ChevronRight, Home, CheckSquare, AlertTriangle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface TestInterfaceProps {
  testType: 'quick' | 'comprehensive';
  onReturnHome: () => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ testType, onReturnHome }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [testComplete, setTestComplete] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Initialize test with questions
  useEffect(() => {
    if (testType === 'quick') {
      setQuestions(getQuickAssessmentQuestions());
    } else {
      setQuestions(getComprehensiveQuestions());
    }
  }, [testType]);
  
  // Timer for the test
  useEffect(() => {
    if (testComplete) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testComplete]);
  
  // Handle user's answer to current question
  const handleAnswer = (answer: boolean) => {
    const updatedAnswers = [...userAnswers];
    const currentQuestion = questions[currentQuestionIndex];
    
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
  const handleCompleteTest = () => {
    const testResult = calculateResults(questions, userAnswers);
    setResult(testResult);
    setTestComplete(true);
    toast({
      title: "Test Completed!",
      description: "Your results are ready to view.",
    });
  };
  
  // Save progress (in a real app, this would store to localStorage or backend)
  const handleSaveProgress = () => {
    console.log('Saving progress:', { userAnswers, currentQuestionIndex });
    toast({
      title: "Progress Saved",
      description: "You can continue later from where you left off.",
    });
  };
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (testComplete && result) {
    return <ResultsDashboard result={result} onReturnHome={onReturnHome} />;
  }
  
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-ai-purple-light mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2.5"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (userAnswers.length / questions.length) * 100;
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion.id)?.answer;
  const isAnswered = currentAnswer !== undefined;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const unansweredCount = questions.length - userAnswers.length;
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Test header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {testType === 'quick' ? 'Quick Self-Assessment' : 'Comprehensive Self-Assessment'}
            </h1>
            <div className="flex items-center gap-3 text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              {unansweredCount > 0 && (
                <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {unansweredCount} unanswered
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 px-3 rounded-md flex items-center">
              <Timer className="h-4 w-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium">{formatTime(timeElapsed)}</span>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleSaveProgress} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Save
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onReturnHome} className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
        
        {/* Progress bar */}
        <ProgressBar
          progress={Math.round(progress)}
          label={`${Math.round(progress)}% Complete`}
          color={progress === 100 ? "bg-green-500" : "bg-ai-purple"}
        />
        
        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          isAnswered={isAnswered}
          selectedAnswer={currentAnswer}
          showFeedback={isAnswered}
        />
        
        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          
          <div className="flex gap-3">
            {isLastQuestion && userAnswers.length > 0 && (
              <Button 
                onClick={handleCompleteTest}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                Finish Test
              </Button>
            )}
            
            <Button
              onClick={handleNextQuestion}
              disabled={isLastQuestion}
              className="flex items-center gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
