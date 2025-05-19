
export type FluencyTier = {
  name: string;
  range: [number, number];
  description: string;
  color: string;
};

export type CategoryScore = {
  categoryId: string;
  categoryName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
};

export type TestResult = {
  overallScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  tier: FluencyTier;
  categoryScores: CategoryScore[];
  timestamp: Date;
};
