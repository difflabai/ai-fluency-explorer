
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ProgressBar from './ProgressBar';
import ScoreChart from './ScoreChart';
import ShareResults from './ShareResults';
import { TestResult } from '@/utils/scoring';
import { Trophy, Home, BarChart2, PieChart } from 'lucide-react';

interface ResultsDashboardProps {
  result: TestResult;
  onReturnHome: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onReturnHome }) => {
  const { overallScore, maxPossibleScore, percentageScore, tier, categoryScores } = result;
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={onReturnHome} className="mb-6">
        <Home className="h-4 w-4 mr-2" /> Return to Home
      </Button>
      
      <div className="flex flex-col gap-8">
        {/* Main results card with score and tier */}
        <Card className="relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${tier.color}`}></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Your AI Fluency Results
            </CardTitle>
            <CardDescription>
              Completed {new Date(result.timestamp).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Overall Score</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">{overallScore}</span>
                  <span className="text-muted-foreground">/ {maxPossibleScore}</span>
                </div>
                
                <ProgressBar progress={percentageScore} />
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-1">You are a</h3>
                  <div className={`inline-block px-4 py-2 rounded-full ${tier.color} text-white font-semibold text-xl`}>
                    {tier.name}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    {tier.description}
                  </p>
                </div>
              </div>
              
              <div className="border-t md:border-t-0 md:border-l border-gray-200 md:pl-8 pt-6 md:pt-0 flex-1">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  Score Breakdown
                </h3>
                
                <div className="space-y-4">
                  {categoryScores.map((categoryScore) => (
                    <div key={categoryScore.categoryId}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{categoryScore.categoryName}</span>
                        <span className="text-sm text-muted-foreground">
                          {categoryScore.score}/{categoryScore.totalQuestions}
                        </span>
                      </div>
                      <ProgressBar
                        progress={categoryScore.percentage}
                        color={
                          categoryScore.percentage > 80 ? 'bg-green-500' : 
                          categoryScore.percentage > 60 ? 'bg-ai-purple' : 
                          categoryScore.percentage > 40 ? 'bg-blue-500' : 
                          categoryScore.percentage > 20 ? 'bg-orange-500' : 
                          'bg-red-500'
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Radar chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Skill Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScoreChart categoryScores={categoryScores} />
            </CardContent>
          </Card>
          
          {/* Share results */}
          <Card className="h-fit">
            <CardContent className="pt-6">
              <ShareResults result={result} />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button size="lg" onClick={onReturnHome}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
