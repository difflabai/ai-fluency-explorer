
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchResultByShareId, SavedTestResult } from '@/services/testResultService';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProgressBar from './ProgressBar';
import ScoreChart from './ScoreChart';
import { CategoryScore, fluencyTiers } from '@/utils/scoring';
import { Home, Trophy, Clock, User, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const SharedResultView: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [result, setResult] = useState<SavedTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedResult = async () => {
      if (!shareId) return;
      
      setIsLoading(true);
      try {
        const data = await fetchResultByShareId(shareId);
        if (data) {
          setResult(data);
        } else {
          setError("This shared result could not be found or has been removed.");
        }
      } catch (err) {
        console.error("Failed to load shared result:", err);
        setError("An error occurred while loading this result.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedResult();
  }, [shareId]);

  const tier = result ? fluencyTiers.find(t => t.name === result.tier_name) : null;
  const categoryScores = result ? result.category_scores as CategoryScore[] : [];

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
          <div className="text-red-500 text-xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Result Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "This shared result does not exist or has been removed."}</p>
          <Button onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const fluencyLevels = [
    { name: "Novice", maxScore: 9 },
    { name: "Advanced Beginner", maxScore: 10 },
    { name: "Competent", maxScore: 10 },
    { name: "Proficient", maxScore: 10 },
    { name: "Expert", maxScore: 11 }
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => window.location.href = '/'} className="flex items-center gap-2 text-gray-700">
          <Home className="h-4 w-4" /> Return to Home
        </Button>
      </div>
      
      <div className="flex flex-col gap-8">
        {/* Header with shared info */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <ExternalLink className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-sm font-medium">Shared AI Fluency Result</h2>
              <p className="text-xs text-gray-500">
                {result.username ? `Shared by ${result.username}` : 'Shared by an anonymous user'}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(result.created_at), 'MMM d, yyyy')}
          </div>
        </div>
        
        {/* Main results card with score and tier */}
        <Card className="overflow-hidden bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold">AI Fluency Results</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-6">
              {/* Left column - Overall score */}
              <div>
                <h3 className="text-lg font-medium mb-3">Overall Score</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">{result.overall_score}</span>
                  <span className="text-gray-500">/ {result.max_possible_score}</span>
                </div>
                
                <ProgressBar progress={result.percentage_score} color="bg-ai-purple" />
                
                {tier && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Fluency Level</h3>
                    <div className="inline-block px-6 py-2 rounded-full bg-blue-300 text-white font-semibold text-xl">
                      {tier.name}
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      {tier.description}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Right column - Score breakdown */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
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
        
        {/* Lower cards section */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium">Skill Distribution</h3>
            </div>
            <ScoreChart categoryScores={categoryScores} />
          </CardContent>
        </Card>
        
        <div className="flex justify-center mt-4 gap-4">
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'} 
            className="text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            Take Your Own Assessment
          </Button>
          <Button 
            onClick={() => window.location.href = '/leaderboard'} 
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SharedResultView;
