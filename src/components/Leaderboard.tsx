import React, { useEffect, useState } from 'react';
import {
  fetchPaginatedLeaderboard,
  PaginatedLeaderboardResponse,
  SavedTestResult,
  SortOptions,
} from '@/services/testResultService';
import { SortConfig } from './leaderboard/types';
import LeaderboardHeader from './leaderboard/LeaderboardHeader';
import LeaderboardControls from './leaderboard/LeaderboardControls';
import DebugInfo from './leaderboard/DebugInfo';
import LeaderboardTable from './leaderboard/LeaderboardTable';
import EmptyState from './leaderboard/EmptyState';
import LoadingSpinner from './leaderboard/LoadingSpinner';
import PaginationControls from './leaderboard/PaginationControls';
import PageSizeSelector from './leaderboard/PageSizeSelector';
import TableSkeleton from './leaderboard/TableSkeleton';

const Leaderboard: React.FC = () => {
  const [paginatedData, setPaginatedData] = useState<PaginatedLeaderboardResponse>({
    data: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 20,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const [showTestData, setShowTestData] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'rank',
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Load leaderboard whenever dependencies change
  useEffect(() => {
    loadLeaderboard();
  }, [showTestData, currentPage, pageSize, sortConfig]);

  const loadLeaderboard = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    } else {
      setIsChangingPage(true);
    }

    try {
      const sortOptions: SortOptions = {
        field: sortConfig.field,
        direction: sortConfig.direction,
      };

      const response = await fetchPaginatedLeaderboard(
        currentPage,
        pageSize,
        showTestData,
        sortOptions
      );

      setPaginatedData(response);
    } catch (error) {
      console.error('Failed to load leaderboard data:', error);
    } finally {
      setIsLoading(false);
      setIsChangingPage(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSortChange = (newSortConfig: SortConfig) => {
    setSortConfig(newSortConfig);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleRefresh = () => {
    loadLeaderboard(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <TableSkeleton rows={pageSize} />;
    }

    if (paginatedData.data.length === 0) {
      return <EmptyState />;
    }

    return (
      <>
        {isChangingPage && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        )}
        <LeaderboardTable
          sortedData={paginatedData.data}
          sortConfig={sortConfig}
          setSortConfig={handleSortChange}
          currentPage={paginatedData.currentPage}
          pageSize={paginatedData.pageSize}
          totalCount={paginatedData.totalCount}
        />
      </>
    );
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <LeaderboardHeader />

      <LeaderboardControls
        showTestData={showTestData}
        setShowTestData={setShowTestData}
      />

      <PageSizeSelector
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        onRefresh={handleRefresh}
        isLoading={isLoading || isChangingPage}
        totalEntries={paginatedData.totalCount}
        currentPage={currentPage}
      />

      <DebugInfo
        sortConfig={sortConfig}
        sortedData={paginatedData.data}
        showTestData={showTestData}
      />

      {/* Additional debug section */}
      <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm border border-yellow-200">
        <p>
          <strong>🔍 Debug Analysis:</strong>
        </p>
        <p>
          <strong>Total records:</strong> {paginatedData.totalCount}
        </p>
        <p>
          <strong>Current page:</strong> {paginatedData.currentPage} of{' '}
          {paginatedData.totalPages}
        </p>
        <p>
          <strong>Page size:</strong> {paginatedData.pageSize}
        </p>
        <p>
          <strong>Records on current page:</strong> {paginatedData.data.length}
        </p>
        <p>
          <strong>Test data records on page:</strong>{' '}
          {paginatedData.data.filter((item) => item.is_test_data).length}
        </p>
        <p>
          <strong>Current sort:</strong> {sortConfig.field} ({sortConfig.direction})
        </p>
      </div>

      <div className="relative">{renderContent()}</div>

      <PaginationControls
        currentPage={paginatedData.currentPage}
        totalPages={paginatedData.totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading || isChangingPage}
      />
    </div>
  );
};

export default Leaderboard;
