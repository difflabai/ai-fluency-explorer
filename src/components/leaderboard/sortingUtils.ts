
import { SortConfig, SortField } from './types';

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
