
import { SavedTestResult } from '@/services/testResultService';
import { SortConfig, SortField, SortDirection } from './types';

export const sortLeaderboardData = (
  data: SavedTestResult[], 
  sortConfig: SortConfig
): SavedTestResult[] => {
  return [...data].sort((a, b) => {
    const { field, direction } = sortConfig;
    let comparison = 0;

    switch (field) {
      case 'rank':
        // Rank is based on score (higher score = better rank)
        comparison = b.overall_score - a.overall_score;
        break;
      case 'username':
        const usernameA = (a.username || 'Anonymous User').toLowerCase();
        const usernameB = (b.username || 'Anonymous User').toLowerCase();
        comparison = usernameA.localeCompare(usernameB);
        break;
      case 'score':
        comparison = a.overall_score - b.overall_score;
        break;
      case 'tier':
        const tierOrder = { 'Novice': 1, 'Advanced Beginner': 2, 'Competent': 3, 'Proficient': 4, 'Expert': 5 };
        const tierA = tierOrder[a.tier_name as keyof typeof tierOrder] || 0;
        const tierB = tierOrder[b.tier_name as keyof typeof tierOrder] || 0;
        comparison = tierA - tierB;
        break;
      case 'date':
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        comparison = dateA - dateB;
        console.log(`Comparing dates: ${a.created_at} (${dateA}) vs ${b.created_at} (${dateB}) = ${comparison}`);
        break;
      default:
        comparison = 0;
    }

    const result = direction === 'asc' ? comparison : -comparison;
    console.log(`Sort ${field} ${direction}: ${result}`);
    return result;
  });
};

export const createSortHandler = (
  currentConfig: SortConfig,
  setSortConfig: (config: SortConfig) => void
) => {
  return (field: SortField) => {
    setSortConfig({
      field,
      direction: currentConfig.field === field && currentConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };
};
