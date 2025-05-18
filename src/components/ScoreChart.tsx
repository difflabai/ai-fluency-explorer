
import React from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  Legend
} from 'recharts';
import { CategoryScore } from '@/utils/scoring';

interface ScoreChartProps {
  categoryScores: CategoryScore[];
}

const ScoreChart: React.FC<ScoreChartProps> = ({ categoryScores }) => {
  // Filter out the fluency level categories for the radar chart
  const filteredScores = categoryScores.filter(score => 
    !['Novice', 'Advanced Beginner', 'Competent', 'Proficient', 'Expert'].includes(score.categoryName)
  );

  const chartData = filteredScores.map((score) => ({
    subject: score.categoryName,
    score: score.percentage,
    fullMark: 100,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#666', fontSize: 12 }} 
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <Radar
            name="Your Score"
            dataKey="score"
            stroke="#9b87f5"
            fill="#9b87f5"
            fillOpacity={0.6}
          />
          <Legend 
            wrapperStyle={{ 
              position: 'relative', 
              marginTop: '10px',
              textAlign: 'center'
            }}
            formatter={() => <span className="text-purple-500">Your Score</span>}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;
