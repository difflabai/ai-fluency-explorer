export const calculateDifficultyScores = (questionsSnapshot: any[] | null) => {
  if (!questionsSnapshot) {
    return {
      novice: 9,
      'advanced-beginner': 10,
      competent: 10,
      proficient: 10,
      expert: 11,
    };
  }

  const difficultyMap: Record<string, number> = {
    novice: 0,
    'advanced-beginner': 0,
    competent: 0,
    proficient: 0,
    expert: 0,
  };

  // Count questions by difficulty
  questionsSnapshot.forEach((question: any) => {
    if (
      question.difficulty &&
      Object.prototype.hasOwnProperty.call(difficultyMap, question.difficulty)
    ) {
      difficultyMap[question.difficulty]++;
    }
  });

  return difficultyMap;
};
