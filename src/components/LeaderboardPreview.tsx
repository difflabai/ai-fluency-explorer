
import React, { useEffect, useState } from 'react';
import { fetchLeaderboard, SavedTestResult } from '@/services/testResultService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Trophy, Medal, ChevronRight, Database, ExternalLink, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const LeaderboardPreview: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<SavedTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        // Fetch top 10 with weighted ranking
        const data = await fetchLeaderboard(10, true, true);
        setLeaderboardData(data);
      } catch (error) {
        console.error("Failed to load leaderboard preview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (index === 1) return <Medal className="h-4 w-4 text-gray-500" />;
    if (index === 2) return <Medal className="h-4 w-4 text-amber-600" />;
    return <span className="text-sm font-medium text-purple-600">{index + 1}</span>;
  };

  const getRankBadgeColor = (index: number) => {
    if (index === 0) return "bg-yellow-100 text-yellow-700";
    if (index === 1) return "bg-gray-100 text-gray-700";
    if (index === 2) return "bg-amber-100 text-amber-700";
    return "bg-purple-100 text-purple-700";
  };

  return (
    <Card className="bg-white shadow-sm overflow-hidden">
      <CardHeader className="bg-purple-50 pb-4">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Trophy className="h-5 w-5" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : leaderboardData.length > 0 ? (
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b">
                  <TableCell className="font-medium text-xs text-gray-600 py-2 px-3">Rank</TableCell>
                  <TableCell className="font-medium text-xs text-gray-600 py-2 px-3">User</TableCell>
                  <TableCell className="font-medium text-xs text-gray-600 py-2 px-3">Score</TableCell>
                  <TableCell className="font-medium text-xs text-gray-600 py-2 px-3 hidden md:table-cell">Level</TableCell>
                  <TableCell className="font-medium text-xs text-gray-600 py-2 px-3 hidden md:table-cell">Date</TableCell>
                  <TableCell className="font-medium text-xs text-gray-600 py-2 px-3 w-12"></TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((entry, index) => (
                  <TableRow 
                    key={entry.id}
                    className={`
                      hover:bg-gray-50 transition-colors border-b border-gray-100
                      ${entry.is_test_data 
                        ? "bg-blue-50 hover:bg-blue-100" 
                        : index < 3 
                          ? "bg-purple-50 hover:bg-purple-100" 
                          : "hover:bg-gray-50"
                      }
                    `}
                  >
                    <TableCell className="py-3 px-3">
                      <div className={`flex items-center justify-center h-7 w-7 rounded-full ${getRankBadgeColor(index)}`}>
                        {getRankIcon(index)}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                          {entry.is_test_data ? (
                            <Database className="h-3 w-3 text-blue-600" />
                          ) : (
                            <User className="h-3 w-3 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                            {entry.username || "Anonymous User"}
                            {entry.is_test_data && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded">
                                Test
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-3">
                      <div className="text-sm text-gray-900 font-semibold">{entry.overall_score}</div>
                      <div className="text-xs text-gray-500">of {entry.max_possible_score}</div>
                    </TableCell>
                    <TableCell className="py-3 px-3 hidden md:table-cell">
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
                    <TableCell className="py-3 px-3 hidden md:table-cell">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(entry.created_at), 'MMM d')}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-3">
                      <Link to={`/shared/${entry.share_id}`}>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="p-4 border-t border-gray-100">
              <Link to="/leaderboard">
                <Button variant="ghost" className="w-full justify-between text-purple-600 hover:bg-purple-50">
                  View Full Leaderboard 
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <p className="text-gray-500 mb-3">No results yet</p>
            <p className="text-sm text-gray-400">Complete the test to be the first!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardPreview;
