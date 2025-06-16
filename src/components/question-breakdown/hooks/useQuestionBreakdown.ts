
import { useState, useMemo } from 'react';

export const useQuestionBreakdown = (questions: any[]) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const groupedQuestions = useMemo(() => {
    if (!questions || questions.length === 0) return {};
    
    return questions.reduce((acc, question) => {
      const category = question.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(question);
      return acc;
    }, {} as Record<string, any[]>);
  }, [questions]);

  return {
    groupedQuestions,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty
  };
};
