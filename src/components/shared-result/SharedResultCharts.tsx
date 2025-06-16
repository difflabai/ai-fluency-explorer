
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Award, BookOpen } from 'lucide-react';
import ScoreChart from '../ScoreChart';
import { CategoryScore } from '@/utils/scoring';

interface SharedResultChartsProps {
  categoryScores: CategoryScore[];
}

const SharedResultCharts: React.FC<SharedResultChartsProps> = ({ categoryScores }) => {
  console.log("SharedResultCharts received categoryScores:", categoryScores);
  
  // Filter for skill categories only
  const skillCategories = categoryScores.filter(score => 
    ['Prompt Engineering', 'AI Ethics', 'Technical Concepts', 'Practical Applications'].includes(score.categoryName)
  );

  // Calculate insights
  const averageScore = skillCategories.length > 0 
    ? skillCategories.reduce((sum, cat) => sum + cat.percentage, 0) / skillCategories.length 
    : 0;
  
  const strongestCategory = skillCategories.length > 0 
    ? skillCategories.reduce((prev, current) => 
        (prev.percentage > current.percentage) ? prev : current, skillCategories[0]
      )
    : { categoryName: 'N/A', percentage: 0 };
  
  const categoryIcons = {
    'Prompt Engineering': <Target className="h-4 w-4" />,
    'AI Ethics': <Award className="h-4 w-4" />,
    'Technical Concepts': <TrendingUp className="h-4 w-4" />,
    'Practical Applications': <BookOpen className="h-4 w-4" />
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { label: 'Expert', color: 'bg-emerald-500' };
    if (percentage >= 80) return { label: 'Advanced', color: 'bg-blue-500' };
    if (percentage >= 70) return { label: 'Proficient', color: 'bg-yellow-500' };
    if (percentage >= 60) return { label: 'Competent', color: 'bg-orange-500' };
    return { label: 'Developing', color: 'bg-red-500' };
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Performance Distribution</CardTitle>
          <Badge variant="outline" className="text-sm">
            Avg: {Math.round(averageScore)}%
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          This radar chart visualizes your expertise across key AI knowledge domains.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Radar Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
          <ScoreChart categoryScores={categoryScores} />
        </div>

        {/* Performance Breakdown */}
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Detailed Performance Analysis
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map((category) => {
              const performance = getPerformanceLevel(category.percentage);
              const Icon = categoryIcons[category.categoryName as keyof typeof categoryIcons];
              
              return (
                <div 
                  key={category.categoryId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      {Icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{category.categoryName}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {category.score} / {category.totalQuestions} questions
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {Math.round(category.percentage)}%
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs text-white mt-1 ${performance.color}`}
                    >
                      {performance.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Key Insights
          </h4>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span><strong>Strongest Area:</strong> {strongestCategory.categoryName} ({Math.round(strongestCategory.percentage)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span><strong>Overall Performance:</strong> {getPerformanceLevel(averageScore).label} level across all categories</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SharedResultCharts;
