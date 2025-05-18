
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';

interface TestNavigationProps {
  isLastQuestion: boolean;
  hasAnswers: boolean;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onCompleteTest: () => void;
  currentQuestionIndex: number;
}

const TestNavigation: React.FC<TestNavigationProps> = ({
  isLastQuestion,
  hasAnswers,
  onPreviousQuestion,
  onNextQuestion,
  onCompleteTest,
  currentQuestionIndex
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPreviousQuestion}
        disabled={currentQuestionIndex === 0}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" /> Previous
      </Button>
      
      <div className="flex gap-3">
        {isLastQuestion && hasAnswers && (
          <Button 
            onClick={onCompleteTest}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <CheckSquare className="h-4 w-4" />
            Finish Test
          </Button>
        )}
        
        <Button
          onClick={onNextQuestion}
          disabled={isLastQuestion}
          className="flex items-center gap-1"
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TestNavigation;
