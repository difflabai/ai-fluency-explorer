
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import { Question, UserAnswer, getQuickAssessmentQuestions, getComprehensiveQuestions } from '@/utils/testData';
import { calculateResults, TestResult } from '@/utils/scoring';
import ResultsDashboard from './ResultsDashboard';
import { Save, Timer, ChevronLeft, ChevronRight } from 'lucide-react';

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
  };
  
  // Save progress (in a real app, this would store to localStorage or backend)
  const handleSaveProgress = () => {
    console.log('Saving progress:', { userAnswers, currentQuestionIndex });
    // Would implement actual saving logic here
    alert('Progress saved! You can continue later.');
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
    return <div className="text-center p-8">Loading questions...</div>;
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (userAnswers.length / questions.length) * 100;
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion.id)?.answer;
  const isAnswered = currentAnswer !== undefined;
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Test header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              {testType === 'quick' ? 'Quick Self-Assessment' : 'Comprehensive Self-Assessment'}
            </h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-2 rounded-md flex items-center">
              <Timer className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{formatTime(timeElapsed)}</span>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleSaveProgress}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
        
        {/* Progress bar */}
        <ProgressBar
          progress={Math.round(progress)}
          label={`${Math.round(progress)}% Complete`}
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
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          
          <div className="flex gap-2">
            {currentQuestionIndex === questions.length - 1 && userAnswers.length > 0 && (
              <Button onClick={handleCompleteTest}>
                Finish Test
              </Button>
            )}
            
            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
