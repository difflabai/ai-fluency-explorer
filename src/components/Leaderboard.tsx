
import React, { useEffect, useState } from 'react';
import { fetchLeaderboard, SavedTestResult } from '@/services/testResultService';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Trophy, Calendar, User, Medal, Database, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';

type SortField = 'rank' | 'username' | 'score' | 'tier' | 'date';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

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
    const sorted = [...leaderboardData].sort((a, b) => {
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

  const handleSort = (field: SortField) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-300" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-gray-600" /> : 
      <ChevronDown className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-purple-600 flex items-center gap-2">
          <Trophy className="h-8 w-8" />
          AI Fluency Leaderboard
        </h1>
        
        <Button variant="ghost" onClick={() => window.location.href = '/'} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Return Home
        </Button>
      </div>
      
      {/* Toggle for test data visibility */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Display Controls</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="test-data-toggle"
            checked={showTestData}
            onCheckedChange={setShowTestData}
          />
          <Label htmlFor="test-data-toggle" className="text-sm">Show Test Data</Label>
        </div>
      </div>

      {/* Debug info */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
        <p><strong>Current sort:</strong> {sortConfig.field} ({sortConfig.direction})</p>
        <p><strong>Total records:</strong> {sortedData.length}</p>
        <p><strong>Test data visible:</strong> {showTestData ? 'Yes' : 'No'}</p>
        <p><strong>Test data count:</strong> {sortedData.filter(item => item.is_test_data).length}</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : sortedData.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-16">
                  <button 
                    onClick={() => handleSort('rank')}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    Rank
                    {getSortIcon('rank')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('username')}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    User
                    {getSortIcon('username')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('score')}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    Score
                    {getSortIcon('score')}
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button 
                    onClick={() => handleSort('tier')}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    Fluency Level
                    {getSortIcon('tier')}
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button 
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    Date
                    {getSortIcon('date')}
                  </button>
                </TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((entry, index) => (
                <TableRow 
                  key={entry.id} 
                  className={`
                    cursor-pointer hover:bg-gray-50 transition-colors
                    ${entry.is_test_data 
                      ? "bg-blue-50 hover:bg-blue-100" 
                      : index < 3 
                        ? "bg-purple-50 hover:bg-purple-100" 
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <TableCell>
                    <div className="flex items-center">
                      {sortConfig.field === 'rank' && sortConfig.direction === 'asc' && index < 3 ? (
                        <div className={`
                          flex items-center justify-center w-8 h-8 rounded-full 
                          ${index === 0 ? "bg-yellow-100 text-yellow-600" : 
                            index === 1 ? "bg-gray-100 text-gray-600" : 
                            "bg-amber-100 text-amber-600"}
                        `}>
                          <Medal className="h-4 w-4" />
                        </div>
                      ) : (
                        <span className="text-gray-500 font-medium">{index + 1}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                        {entry.is_test_data ? (
                          <Database className="h-4 w-4 text-blue-600" />
                        ) : (
                          <User className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          {entry.username || "Anonymous User"}
                          {entry.is_test_data && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">
                              Test
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 font-semibold">{entry.overall_score}</div>
                    <div className="text-xs text-gray-500">of {entry.max_possible_score}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${entry.tier_name === 'Expert' ? 'bg-purple-100 text-purple-800' :
                        entry.tier_name === 'Proficient' ? 'bg-blue-100 text-blue-800' :
                        entry.tier_name === 'Competent' ? 'bg-green-100 text-green-800' :
                        entry.tier_name === 'Advanced Beginner' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {entry.tier_name}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(entry.created_at), 'MMM d, yyyy')}
                      <span className="text-xs ml-1">
                        ({format(new Date(entry.created_at), 'HH:mm')})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link to={`/shared/${entry.share_id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
          <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">No results yet</h3>
          <p className="text-gray-500 mt-1">Be the first to take the test and appear on the leaderboard!</p>
          <Button onClick={() => window.location.href = '/'} className="mt-4">
            Take the Test
          </Button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
