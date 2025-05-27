
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
  console.log("ScoreChart received category scores:", categoryScores);
  
  // Filter for skill categories only (not fluency levels) for the radar chart
  const skillCategories = ['Prompt Engineering', 'AI Ethics', 'Technical Concepts', 'Practical Applications'];
  
  const filteredScores = categoryScores.filter(score => 
    skillCategories.includes(score.categoryName)
  );
  
  console.log("Filtered scores for radar chart:", filteredScores);
  
  // If we don't have skill category data, create default structure
  if (filteredScores.length === 0) {
    console.warn("No skill category data found, creating default structure");
    
    // Create default data structure for radar chart
    const defaultData = skillCategories.map(categoryName => ({
      subject: categoryName,
      score: 0,
      fullMark: 100,
    }));
    
    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={defaultData}>
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
        <div className="text-center mt-2 text-sm text-gray-500">
          No skill category data available - complete a test to see your performance breakdown
        </div>
      </div>
    );
  }

  const chartData = filteredScores.map((score) => ({
    subject: score.categoryName,
    score: Math.round(score.percentage),
    fullMark: 100,
  }));

  console.log("Final radar chart data:", chartData);

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
