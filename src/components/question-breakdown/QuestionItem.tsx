
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface QuestionItemProps {
  question: any;
  userAnswer: any;
  index: number;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  userAnswer,
  index
}) => {
  const isCorrect = userAnswer?.is_correct;
  const selectedAnswer = userAnswer?.selected_answer;

  const getStatusIcon = () => {
    if (isCorrect === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (isCorrect === false) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <HelpCircle className="h-4 w-4 text-gray-400" />;
  };

  const getStatusColor = () => {
    if (isCorrect === true) return 'border-green-200 bg-green-50';
    if (isCorrect === false) return 'border-red-200 bg-red-50';
    return 'border-gray-200 bg-gray-50';
  };

  return (
    <div className={`p-3 rounded-md border ${getStatusColor()}`}>
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 mt-1">
          {getStatusIcon()}
          <span className="text-xs font-medium text-gray-600">Q{index + 1}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 mb-2 leading-relaxed">
            {question.question_text || question.text}
          </p>
          
          {selectedAnswer && (
            <div className="text-xs text-gray-600 mb-2">
              <span className="font-medium">Your answer:</span> {selectedAnswer}
            </div>
          )}
          
          {question.correct_answer && (
            <div className="text-xs text-gray-600 mb-2">
              <span className="font-medium">Correct answer:</span> {question.correct_answer}
            </div>
          )}
          
          {question.explanation && (
            <div className="text-xs text-gray-700 mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
              <span className="font-medium text-blue-800">Explanation:</span>
              <p className="mt-1 text-blue-700">{question.explanation}</p>
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {question.difficulty || 'unspecified'}
            </Badge>
            {isCorrect !== undefined && (
              <Badge 
                variant="secondary"
                className={`text-xs ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {isCorrect ? 'Correct' : 'Incorrect'}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
