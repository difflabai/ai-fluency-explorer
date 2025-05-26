
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchResultByShareId, SavedTestResult } from '@/services/testResultService';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProgressBar from './ProgressBar';
import ScoreChart from './ScoreChart';
import { CategoryScore, fluencyTiers } from '@/utils/scoring';
import { Home, Trophy, Clock, User, Calendar, ExternalLink, Share2, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

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
          console.log("Loaded shared result data:", data);
          console.log("Category scores type:", typeof data.category_scores);
          console.log("Category scores value:", data.category_scores);
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

  const handleShareResult = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Link Copied",
        description: "The result link has been copied to your clipboard!"
      });
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      toast({
        title: "Share Link",
        description: "Copy this URL to share: " + currentUrl,
      });
    }
  };

  const tier = result ? fluencyTiers.find(t => t.name === result.tier_name) : null;
  
  // Safely handle category scores - ensure it's always an array
  const categoryScores: CategoryScore[] = result ? (() => {
    const scores = result.category_scores;
    console.log("Processing category scores:", scores);
    
    // If it's already an array, return it
    if (Array.isArray(scores)) {
      return scores as CategoryScore[];
    }
    
    // If it's an object, try to convert it to an array
    if (scores && typeof scores === 'object') {
      // Try to extract array from object if it has array properties
      if (scores.categoryScores && Array.isArray(scores.categoryScores)) {
        return scores.categoryScores as CategoryScore[];
      }
      
      // If it's an object with category data, convert to array format
      return Object.entries(scores).map(([key, value]: [string, any]) => ({
        categoryId: key,
        categoryName: value.categoryName || key,
        score: value.score || 0,
        totalQuestions: value.totalQuestions || 0,
        percentage: value.percentage || 0
      }));
    }
    
    return [];
  })() : [];

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
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => window.location.href = '/'} className="flex items-center gap-2 text-gray-700">
          <Home className="h-4 w-4" /> Return to Home
        </Button>
        
        <Button onClick={handleShareResult} variant="outline" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share Result
        </Button>
      </div>
      
      <div className="flex flex-col gap-8">
        {/* Header with shared info */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-100">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <Trophy className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Fluency Assessment Results</h1>
                <p className="text-gray-600 mt-1">
                  {result.username ? `Shared by ${result.username}` : 'Shared by an anonymous user'}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(result.created_at), 'MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-1">
                    <ExternalLink className="h-4 w-4" />
                    <span>Share ID: {result.share_id.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
            </div>
            
            {result.is_test_data && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Test Data
              </div>
            )}
          </div>
        </div>
        
        {/* Main results cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Overall Score Card */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Overall Performance
              </h3>
              
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold text-purple-600">{result.overall_score}</span>
                  <span className="text-xl text-gray-500">/ {result.max_possible_score}</span>
                </div>
                <div className="text-lg text-gray-600 mb-4">
                  {Math.round(result.percentage_score)}% Accuracy
                </div>
                <ProgressBar progress={result.percentage_score} color="bg-purple-500" />
              </div>
              
              {tier && (
                <div className="text-center">
                  <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-xl mb-3">
                    {tier.name}
                  </div>
                  <p className="text-sm text-gray-600">
                    {tier.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Score Breakdown Card */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Skill Breakdown
              </h3>
              
              <div className="space-y-4">
                {fluencyLevels.map((level) => {
                  const categoryScore = Array.isArray(categoryScores) 
                    ? categoryScores.find(c => c.categoryName === level.name)
                    : null;
                  const score = categoryScore?.score || 0;
                  const total = categoryScore?.totalQuestions || level.maxScore;
                  const percentage = (score / total) * 100;
                  
                  return (
                    <div key={level.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{level.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{score}/{total}</span>
                          <span className="text-xs text-gray-500">({Math.round(percentage)}%)</span>
                        </div>
                      </div>
                      <ProgressBar
                        progress={percentage}
                        color={percentage >= 80 ? "bg-green-500" : percentage >= 60 ? "bg-yellow-500" : "bg-red-500"}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Chart Card */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Distribution</h3>
            <ScoreChart categoryScores={categoryScores} />
          </CardContent>
        </Card>
        
        {/* Action buttons */}
        <div className="flex justify-center gap-4">
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
