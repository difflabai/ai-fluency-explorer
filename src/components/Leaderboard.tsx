
import React, { useEffect, useState } from 'react';
import { fetchLeaderboard, SavedTestResult } from '@/services/testResultService';
import { SortConfig } from './leaderboard/types';
import { sortLeaderboardData } from './leaderboard/sortingUtils';
import LeaderboardHeader from './leaderboard/LeaderboardHeader';
import LeaderboardControls from './leaderboard/LeaderboardControls';
import DebugInfo from './leaderboard/DebugInfo';
import LeaderboardTable from './leaderboard/LeaderboardTable';
import EmptyState from './leaderboard/EmptyState';
import LoadingSpinner from './leaderboard/LoadingSpinner';

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<SavedTestResult[]>([]);
  const [sortedData, setSortedData] = useState<SavedTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTestData, setShowTestData] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'rank', direction: 'asc' });

  useEffect(() => {
    loadLeaderboard();
  }, [showTestData]);

  useEffect(() => {
    // Sort data whenever leaderboardData or sortConfig changes
    const sorted = sortLeaderboardData(leaderboardData, sortConfig);

    console.log(`Sorted data for ${sortConfig.field} ${sortConfig.direction}:`, sorted.map(item => ({
      username: item.username,
      date: item.created_at,
      isTestData: item.is_test_data
    })));

    setSortedData(sorted);
  }, [leaderboardData, sortConfig]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      console.log("Leaderboard - showTestData:", showTestData);
      
      const data = await fetchLeaderboard(20, showTestData);
      console.log("Leaderboard - fetched data:", data);
      console.log("Leaderboard - data with dates:", data.map(item => ({
        username: item.username,
        date: item.created_at,
        isTestData: item.is_test_data
      })));
      
      setLeaderboardData(data);
    } catch (error) {
      console.error("Failed to load leaderboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <LeaderboardHeader />
      
      <LeaderboardControls 
        showTestData={showTestData}
        setShowTestData={setShowTestData}
      />

      <DebugInfo 
        sortConfig={sortConfig}
        sortedData={sortedData}
        showTestData={showTestData}
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : sortedData.length > 0 ? (
        <LeaderboardTable 
          sortedData={sortedData}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default Leaderboard;
