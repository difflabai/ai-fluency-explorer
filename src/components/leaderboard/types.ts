
import { SavedTestResult } from '@/services/testResultService';

export type SortField = 'rank' | 'username' | 'score' | 'tier' | 'date';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface LeaderboardEntry extends SavedTestResult {}
