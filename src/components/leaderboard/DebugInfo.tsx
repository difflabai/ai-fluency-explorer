
import React from 'react';
import { SavedTestResult } from '@/services/testResultService';
import { SortConfig } from './types';

interface DebugInfoProps {
  sortConfig: SortConfig;
  sortedData: SavedTestResult[];
  showTestData: boolean;
}

const DebugInfo: React.FC<DebugInfoProps> = ({
  sortConfig,
  sortedData,
  showTestData
}) => {
  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
      <p><strong>Current sort:</strong> {sortConfig.field} ({sortConfig.direction})</p>
      <p><strong>Total records:</strong> {sortedData.length}</p>
      <p><strong>Test data visible:</strong> {showTestData ? 'Yes' : 'No'}</p>
      <p><strong>Test data count:</strong> {sortedData.filter(item => item.is_test_data).length}</p>
    </div>
  );
};

export default DebugInfo;
