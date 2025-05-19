import React, { useEffect, useState } from 'react';
import { fetchLeaderboard, SavedTestResult } from '@/services/testResultService';
import { Button } from "@/components/ui/button";
import { Home, Trophy, Calendar, ArrowUp, User, Medal, Database } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<SavedTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTestData, setShowTestData] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadLeaderboard();
  }, [showTestData]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeaderboard();
      // If admin user and showTestData is true, include test data
      // Otherwise filter out test data
      const filteredData = isAdmin && showTestData 
        ? data 
        : data.filter(entry => !entry.is_test_data);
        
      setLeaderboardData(filteredData);
    } catch (error) {
      console.error("Failed to load leaderboard data:", error);
    } finally {
      setIsLoading(false);
    }
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
      
      {/* Admin-only toggle for test data visibility */}
      {isAdmin && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Admin Controls</span>
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
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : leaderboardData.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Fluency Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboardData.map((entry, index) => (
                <tr key={entry.id} className={
                  entry.is_test_data 
                    ? "bg-blue-50" 
                    : index < 3 
                      ? "bg-purple-50" 
                      : ""
                }>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index < 3 ? (
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-semibold">{entry.overall_score}</div>
                    <div className="text-xs text-gray-500">of {entry.max_possible_score}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${entry.tier_name === 'Expert' ? 'bg-purple-100 text-purple-800' :
                        entry.tier_name === 'Proficient' ? 'bg-blue-100 text-blue-800' :
                        entry.tier_name === 'Competent' ? 'bg-green-100 text-green-800' :
                        entry.tier_name === 'Advanced Beginner' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {entry.tier_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(entry.created_at), 'MMM d, yyyy')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
