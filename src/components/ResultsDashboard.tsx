
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProgressBar from './ProgressBar';
import ScoreChart from './ScoreChart';
import ShareResults from './ShareResults';
import QuestionBreakdown from './QuestionBreakdown';
import { TestResult } from '@/utils/scoring';
import { Trophy, Home, BarChartIcon, Clock, Medal, Users } from 'lucide-react';
import { fetchLeaderboard, SavedTestResult } from '@/services/testResultService';
import { Link } from 'react-router-dom';

interface ResultsDashboardProps {
  result: TestResult;
  onReturnHome: () => void;
  questions?: any[];
  userAnswers?: any[];
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ 
  result, 
  onReturnHome,
  questions = [],
  userAnswers = []
}) => {
  const { overallScore, maxPossibleScore, percentageScore, tier, categoryScores } = result;
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoadingRank, setIsLoadingRank] = useState(true);
  
  // Fetch leaderboard data to determine user's rank
  useEffect(() => {
    const fetchUserRank = async () => {
      try {
        const leaderboardData = await fetchLeaderboard(100);
        const position = leaderboardData.findIndex(entry => 
          entry.overall_score < overallScore
        );
        
        if (position === -1) {
          setUserRank(leaderboardData.length > 0 ? leaderboardData.length + 1 : 1);
        } else {
          setUserRank(position + 1);
        }
      } catch (error) {
        console.error("Failed to fetch user ranking:", error);
      } finally {
        setIsLoadingRank(false);
      }
    };
    
    fetchUserRank();
  }, [overallScore]);
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onReturnHome} className="flex items-center gap-2 text-gray-700">
          <Home className="h-4 w-4" /> Return to Home
        </Button>
      </div>
      
      <div className="flex flex-col gap-8">
        {/* Main results card with score and tier */}
        <Card className="overflow-hidden bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold">Your AI Fluency Results</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Completed {new Date(result.timestamp).toLocaleDateString()}
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left column - Overall score */}
              <div>
                <h3 className="text-lg font-medium mb-3">Overall Score</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">{overallScore}</span>
                  <span className="text-gray-500">/ {maxPossibleScore}</span>
                </div>
                
                <ProgressBar progress={percentageScore} color="bg-ai-purple" />
                
                {/* User Rank Display */}
                {isLoadingRank ? (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-gray-500">Calculating your rank...</span>
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-blue-500 animate-spin"></div>
                  </div>
                ) : userRank && (
                  <div className="mt-4 flex items-center gap-2">
                    <Medal className="h-5 w-5 text-purple-500" />
                    <span className="text-purple-700 font-medium">
                      {userRank === 1 ? (
                        "You're in 1st place! 🎉"
                      ) : (
                        `Your rank: ${userRank}${userRank === 2 ? 'nd' : userRank === 3 ? 'rd' : 'th'} place`
                      )}
                    </span>
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">You are a</h3>
                  <div className="inline-block px-6 py-2 rounded-full bg-blue-300 text-white font-semibold text-xl">
                    {tier.name}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    {tier.description}
                  </p>
                </div>
              </div>
              
              {/* Right column - Score breakdown */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5" />
                  Score Breakdown
                </h3>
                
                <div className="space-y-4">
                  {fluencyLevels.map((level) => {
                    const categoryScore = categoryScores.find(c => c.categoryName === level.name);
                    const score = categoryScore?.score || 0;
                    const total = categoryScore?.totalQuestions || level.maxScore;
                    const percentage = (score / total) * 100;
                    
                    return (
                      <div key={level.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{level.name}</span>
                          <span className="text-sm text-gray-600">
                            {score}/{total}
                          </span>
                        </div>
                        <ProgressBar
                          progress={percentage}
                          color="bg-green-500"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Detailed Question Breakdown */}
        {questions.length > 0 && userAnswers.length > 0 && (
          <QuestionBreakdown 
            questions={questions}
            userAnswers={userAnswers}
            categoryScores={categoryScores}
          />
        )}
        
        {/* Lower cards section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skill Distribution chart */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium">Skill Distribution</h3>
              </div>
              <ScoreChart categoryScores={categoryScores} />
            </CardContent>
          </Card>
          
          {/* Share results */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <ShareResults result={result} />
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/leaderboard">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    View Full Leaderboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button size="lg" onClick={onReturnHome} className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 rounded-lg">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

// Fluency levels for the score breakdown
const fluencyLevels = [
  { name: "Novice", maxScore: 9 },
  { name: "Advanced Beginner", maxScore: 10 },
  { name: "Competent", maxScore: 10 },
  { name: "Proficient", maxScore: 10 },
  { name: "Expert", maxScore: 11 }
];

export default ResultsDashboard;
