
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Zap } from 'lucide-react';
import { QuestionItem } from './QuestionItem';

interface DifficultySectionProps {
  difficulty: string;
  questions: any[];
  userAnswers: any[];
  isSelected: boolean;
  onSelect: () => void;
}

export const DifficultySection: React.FC<DifficultySectionProps> = ({
  difficulty,
  questions,
  userAnswers,
  isSelected,
  onSelect
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'novice': return 'bg-green-100 text-green-800';
      case 'advanced-beginner': return 'bg-blue-100 text-blue-800';
      case 'competent': return 'bg-yellow-100 text-yellow-800';
      case 'proficient': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    return diff.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
      <Button
        variant="ghost"
        onClick={onSelect}
        className="w-full p-3 flex items-center justify-between hover:bg-gray-100 rounded-none"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isSelected ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <Zap className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{getDifficultyLabel(difficulty)}</span>
              <Badge variant="secondary" className={`text-xs ${getDifficultyColor(difficulty)}`}>
                {difficulty}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">{questions.length} questions</p>
          </div>
        </div>
      </Button>

      {isSelected && (
        <div className="border-t border-gray-300 bg-gray-50">
          <div className="p-3 space-y-3">
            {questions.map((question, index) => (
              <QuestionItem
                key={question.id || index}
                question={question}
                userAnswer={userAnswers.find(answer => answer.question_id === question.id)}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
