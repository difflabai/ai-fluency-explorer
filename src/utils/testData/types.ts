
export type TestDataConfig = {
  count: number;
  scoreDistribution: 'random' | 'fixed' | 'gaussian';
  usernamePattern: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  minScore: number;
  maxScore: number;
};

export type GenerationResult = {
  count: number;
  results: any[]; // Will be typed based on SavedTestResult
};
