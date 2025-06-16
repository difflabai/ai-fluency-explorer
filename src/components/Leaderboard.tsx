
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
      console.log("🔍 Leaderboard - showTestData:", showTestData);
      console.log("🔍 Today's date:", new Date().toISOString());
      
      const data = await fetchLeaderboard(20, showTestData);
      console.log("🔍 Leaderboard - fetched data count:", data.length);
      console.log("🔍 Leaderboard - raw fetched data:", data);
      
      // Check for today's data specifically
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const todaysData = data.filter(item => item.created_at.startsWith(today));
      console.log("🔍 Today's data found:", todaysData.length, todaysData);
      
      // Check test data specifically
      const testData = data.filter(item => item.is_test_data);
      console.log("🔍 Test data found:", testData.length, testData.map(item => ({
        username: item.username,
        date: item.created_at,
        isTestData: item.is_test_data
      })));
      
      // Check for very recent data (last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const recentData = data.filter(item => item.created_at >= oneHourAgo);
      console.log("🔍 Recent data (last hour):", recentData.length, recentData.map(item => ({
        username: item.username,
        date: item.created_at,
        isTestData: item.is_test_data
      })));
      
      setLeaderboardData(data);
    } catch (error) {
      console.error("❌ Failed to load leaderboard data:", error);
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
      
      {/* Additional debug section */}
      <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm border border-yellow-200">
        <p><strong>🔍 Debug Analysis:</strong></p>
        <p><strong>Total fetched records:</strong> {leaderboardData.length}</p>
        <p><strong>Test data records:</strong> {leaderboardData.filter(item => item.is_test_data).length}</p>
        <p><strong>Today's records:</strong> {leaderboardData.filter(item => item.created_at.startsWith(new Date().toISOString().split('T')[0])).length}</p>
        <p><strong>Most recent record:</strong> {leaderboardData.length > 0 ? new Date(Math.max(...leaderboardData.map(item => new Date(item.created_at).getTime()))).toISOString() : 'None'}</p>
      </div>
      
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
