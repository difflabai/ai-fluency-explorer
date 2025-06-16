
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Clock } from 'lucide-react';
import { SavedTestResult } from '@/services/testResultService';
import { fluencyTiers } from '@/utils/scoring';
import ProgressBar from '../ProgressBar';

interface SharedResultStatsProps {
  result: SavedTestResult;
  difficultyScores: Record<string, number>;
}

const SharedResultStats: React.FC<SharedResultStatsProps> = ({ result, difficultyScores }) => {
  const tier = fluencyTiers.find(t => t.name === result.tier_name);
  
  const fluencyLevels = [
    { name: "Novice", maxScore: difficultyScores['novice'] || 9 },
    { name: "Advanced Beginner", maxScore: difficultyScores['advanced-beginner'] || 10 },
    { name: "Competent", maxScore: difficultyScores['competent'] || 10 },
    { name: "Proficient", maxScore: difficultyScores['proficient'] || 10 },
    { name: "Expert", maxScore: difficultyScores['expert'] || 11 }
  ];

  return (
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
              <span className="text-4xl font-bold text-purple-600">{result.overall_score}</span>
              <span className="text-lg text-gray-500">/ {result.max_possible_score}</span>
            </div>
            <div className="text-lg text-gray-600 mb-4">
              {Math.round(result.percentage_score)}% Accuracy
            </div>
            <ProgressBar progress={result.percentage_score} color="bg-purple-500" />
          </div>
          
          {tier && (
            <div className="text-center">
              <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-lg mb-3">
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
              const totalQuestions = level.maxScore;
              // Calculate actual score based on the proportion of overall performance
              const actualScore = Math.round((result.overall_score / result.max_possible_score) * totalQuestions);
              const percentage = (actualScore / totalQuestions) * 100;
              
              return (
                <div key={level.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{level.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{actualScore}/{totalQuestions}</span>
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
  );
};

export default SharedResultStats;
