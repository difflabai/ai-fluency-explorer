
import React from 'react';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import ResultsDashboard from './ResultsDashboard';
import { Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TestHeader from './test/TestHeader';
import TestNavigation from './test/TestNavigation';
import { useTestState } from '@/hooks/useTestState';

interface TestInterfaceProps {
  testType: 'quick' | 'comprehensive';
  onReturnHome: () => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ testType, onReturnHome }) => {
  const {
    questions,
    currentQuestionIndex,
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
  } = useTestState({ testType });
  
  if (testComplete && result) {
    return <ResultsDashboard result={result} onReturnHome={onReturnHome} />;
  }
  
  if (isLoading) {
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
  
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-red-600">Error Loading Questions</h2>
          <p className="text-gray-600 mt-2">Unable to load questions for the test.</p>
        </div>
        <Button onClick={onReturnHome} className="flex items-center gap-2">
          <Home className="h-4 w-4" /> Return Home
        </Button>
      </div>
    );
  }
  
  const testTitle = testType === 'quick' 
    ? 'Quick Self-Assessment' 
    : 'Comprehensive Self-Assessment';
    
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Test header */}
        <TestHeader
          title={testTitle}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          unansweredCount={unansweredCount}
          timeElapsed={timeElapsed}
          onSaveProgress={handleSaveProgress}
          onReturnHome={onReturnHome}
        />
        
        {/* Progress bar */}
        <ProgressBar
          progress={Math.round(progress)}
          label={`${Math.round(progress)}% Complete`}
          color={progress === 100 ? "bg-green-500" : "bg-ai-purple"}
        />
        
        {/* Question */}
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            isAnswered={isAnswered}
            selectedAnswer={currentAnswer}
            showFeedback={isAnswered}
          />
        )}
        
        {/* Navigation */}
        <TestNavigation
          isLastQuestion={isLastQuestion}
          hasAnswers={userAnswers.length > 0}
          onPreviousQuestion={handlePreviousQuestion}
          onNextQuestion={handleNextQuestion}
          onCompleteTest={handleCompleteTest}
          currentQuestionIndex={currentQuestionIndex}
        />
      </div>
    </div>
  );
};

export default TestInterface;
