import React from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar, 
  Legend
} from 'recharts';
import { CategoryScore } from '@/utils/scoring';

interface ScoreChartProps {
  categoryScores: CategoryScore[];
}

const ScoreChart: React.FC<ScoreChartProps> = ({ categoryScores }) => {
  // Filter out the fluency level categories for the radar chart
  // We want to keep only the skill categories, not the difficulty levels
  const skillCategories = ['Prompt Engineering', 'AI Ethics', 'Technical Concepts', 'Practical Applications'];
  
  const filteredScores = categoryScores.filter(score => 
    skillCategories.includes(score.categoryName)
  );
  
  // Make sure we have data to display
  if (filteredScores.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-gray-500">No category data available</p>
      </div>
    );
  }

  const chartData = filteredScores.map((score) => ({
    subject: score.categoryName,
    score: Math.round(score.percentage),
    fullMark: 100,
  }));

  console.log("Radar chart data:", chartData);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#666', fontSize: 12 }} 
            axisLine={{ stroke: '#e0e0e0' }}
            className="text-xs"
          />
          <PolarRadiusAxis
            angle={0}
            domain={[0, 100]}
            tick={{ fill: '#999', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Your Score (%)"
            dataKey="score"
            stroke="#9b87f5"
            fill="#9b87f5"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend 
            wrapperStyle={{ 
              position: 'relative', 
              marginTop: '10px',
              textAlign: 'center'
            }}
            formatter={() => <span className="text-purple-500 text-sm font-medium">Your Score (%)</span>}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;
