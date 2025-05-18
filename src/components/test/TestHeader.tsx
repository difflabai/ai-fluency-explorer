
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Timer, Home, AlertTriangle } from 'lucide-react';

interface TestHeaderProps {
  title: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  unansweredCount: number;
  timeElapsed: number;
  onSaveProgress: () => void;
  onReturnHome: () => void;
}

// Format time as mm:ss
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TestHeader: React.FC<TestHeaderProps> = ({
  title,
  currentQuestionIndex,
  totalQuestions,
  unansweredCount,
  timeElapsed,
  onSaveProgress,
  onReturnHome
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center gap-3 text-gray-600">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
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
        
        <Button variant="outline" size="sm" onClick={onSaveProgress} className="flex items-center gap-1">
          <Save className="h-4 w-4" />
          Save
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onReturnHome} className="flex items-center gap-1">
          <Home className="h-4 w-4" />
          Home
        </Button>
      </div>
    </div>
  );
};

export default TestHeader;
