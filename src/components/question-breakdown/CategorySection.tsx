
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Target } from 'lucide-react';
import { CategoryScore } from '@/utils/scoring';
import { DifficultySection } from './DifficultySection';

interface CategorySectionProps {
  category: string;
  questions: any[];
  userAnswers: any[];
  categoryScores: CategoryScore[];
  isSelected: boolean;
  onSelect: () => void;
  selectedDifficulty: string | null;
  onDifficultySelect: (difficulty: string | null) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  questions,
  userAnswers,
  categoryScores,
  isSelected,
  onSelect,
  selectedDifficulty,
  onDifficultySelect
}) => {
  const categoryScore = categoryScores.find(score => score.categoryName === category);
  
  // Group questions by difficulty
  const difficultyGroups = questions.reduce((acc, question) => {
    const difficulty = question.difficulty || 'unspecified';
    if (!acc[difficulty]) {
      acc[difficulty] = [];
    }
    acc[difficulty].push(question);
    return acc;
  }, {} as Record<string, any[]>);

  const difficultyOrder = ['novice', 'advanced-beginner', 'competent', 'proficient', 'expert', 'unspecified'];
  const sortedDifficulties = Object.keys(difficultyGroups).sort((a, b) => {
    return difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b);
  });

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Button
        variant="ghost"
        onClick={onSelect}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-none"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isSelected ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <Target className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{category}</h3>
            <p className="text-sm text-gray-600">{questions.length} questions</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {categoryScore && (
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {categoryScore.score}/{categoryScore.totalQuestions}
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  categoryScore.percentage >= 80 ? 'bg-green-100 text-green-800' :
                  categoryScore.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {categoryScore.percentage}%
              </Badge>
            </div>
          )}
        </div>
      </Button>

      {isSelected && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-4 space-y-4">
            {sortedDifficulties.map(difficulty => (
              <DifficultySection
                key={difficulty}
                difficulty={difficulty}
                questions={difficultyGroups[difficulty]}
                userAnswers={userAnswers}
                isSelected={selectedDifficulty === difficulty}
                onSelect={() => onDifficultySelect(selectedDifficulty === difficulty ? null : difficulty)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
