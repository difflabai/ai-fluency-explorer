
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from 'lucide-react';
import { CategoryScore } from '@/utils/scoring';
import { CategorySection } from './CategorySection';
import { useQuestionBreakdown } from './hooks/useQuestionBreakdown';

interface QuestionBreakdownProps {
  questions: any[];
  userAnswers: any[];
  categoryScores: CategoryScore[];
}

const QuestionBreakdown: React.FC<QuestionBreakdownProps> = ({ 
  questions, 
  userAnswers, 
  categoryScores 
}) => {
  const { 
    groupedQuestions, 
    selectedCategory, 
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty
  } = useQuestionBreakdown(questions);

  if (!questions || questions.length === 0) {
    return (
      <Card className="bg-gray-50 border border-gray-200">
        <CardContent className="p-6 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Question Details Available</h3>
          <p className="text-gray-600">
            Question breakdown is not available for this shared result.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-purple-500" />
          Detailed Question Breakdown
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Explore your performance across different categories and difficulty levels.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
          <CategorySection
            key={category}
            category={category}
            questions={categoryQuestions as any[]}
            userAnswers={userAnswers}
            categoryScores={categoryScores}
            isSelected={selectedCategory === category}
            onSelect={() => setSelectedCategory(selectedCategory === category ? null : category)}
            selectedDifficulty={selectedDifficulty}
            onDifficultySelect={setSelectedDifficulty}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default QuestionBreakdown;
