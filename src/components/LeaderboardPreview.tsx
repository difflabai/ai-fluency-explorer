
import React, { useEffect, useState } from 'react';
import { fetchLeaderboard, SavedTestResult } from '@/services/testResultService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, ChevronRight, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

const LeaderboardPreview: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<SavedTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        // Only fetch top 5 for preview
        const data = await fetchLeaderboard(5);
        // Filter out test data for non-admins
        const filteredData = isAdmin 
          ? data 
          : data.filter(entry => !entry.is_test_data);
        setLeaderboardData(filteredData);
      } catch (error) {
        console.error("Failed to load leaderboard preview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [isAdmin]);

  return (
    <Card className="bg-white shadow-sm overflow-hidden">
      <CardHeader className="bg-purple-50 pb-4">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Trophy className="h-5 w-5" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : leaderboardData.length > 0 ? (
          <div className="space-y-4">
            {leaderboardData.map((entry, index) => (
              <div key={entry.id} className="flex items-center justify-between gap-2 py-2">
                <div className="flex items-center gap-3">
                  <div className={`
                    flex items-center justify-center w-7 h-7 rounded-full 
                    ${index === 0 ? "bg-yellow-100 text-yellow-600" : 
                      index === 1 ? "bg-gray-100 text-gray-600" : 
                      index === 2 ? "bg-amber-100 text-amber-600" :
                      "bg-purple-50 text-purple-500"}
                  `}>
                    {index < 3 ? <Medal className="h-3 w-3" /> : <span className="text-xs">{index + 1}</span>}
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      {entry.username || "Anonymous User"}
                      {entry.is_test_data && (
                        <Database className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(entry.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{entry.overall_score} pts</div>
                  <div className="text-xs text-gray-500">{entry.tier_name}</div>
                </div>
              </div>
            ))}
            
            <Link to="/leaderboard" className="block mt-4 pt-3 border-t border-gray-100">
              <Button variant="ghost" className="w-full justify-between text-purple-600">
                View Full Leaderboard 
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-3">No results yet</p>
            <p className="text-sm text-gray-400">Complete the test to be the first!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardPreview;
