
import React from 'react';
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { SavedTestResult } from '@/services/testResultService';
import { SortConfig } from './types';
import SortableTableHeader from './SortableTableHeader';
import LeaderboardTableRow from './LeaderboardTableRow';
import { createSortHandler } from './sortingUtils';

interface LeaderboardTableProps {
  sortedData: SavedTestResult[];
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  sortedData,
  sortConfig,
  setSortConfig
}) => {
  const handleSort = createSortHandler(sortConfig, setSortConfig);

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <SortableTableHeader
              field="rank"
              sortConfig={sortConfig}
              onSort={handleSort}
              className="w-16"
            >
              Rank
            </SortableTableHeader>
            <SortableTableHeader
              field="username"
              sortConfig={sortConfig}
              onSort={handleSort}
            >
              User
            </SortableTableHeader>
            <SortableTableHeader
              field="score"
              sortConfig={sortConfig}
              onSort={handleSort}
            >
              Score
            </SortableTableHeader>
            <SortableTableHeader
              field="tier"
              sortConfig={sortConfig}
              onSort={handleSort}
              className="hidden md:table-cell"
            >
              Fluency Level
            </SortableTableHeader>
            <SortableTableHeader
              field="date"
              sortConfig={sortConfig}
              onSort={handleSort}
              className="hidden md:table-cell"
            >
              Date
            </SortableTableHeader>
            <SortableTableHeader
              field="rank"
              sortConfig={sortConfig}
              onSort={handleSort}
              className="w-16"
            >
              Actions
            </SortableTableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((entry, index) => (
            <LeaderboardTableRow
              key={entry.id}
              entry={entry}
              index={index}
              sortConfig={sortConfig}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
