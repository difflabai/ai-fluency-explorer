
import React from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar, 
  Legend,
  Tooltip
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
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={defaultData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid 
              stroke="#e5e7eb" 
              strokeWidth={1}
              radialLines={true}
            />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ 
                fill: '#374151', 
                fontSize: 12, 
                fontWeight: 500 
              }} 
              axisLine={false}
              className="text-xs font-medium"
            />
            <PolarRadiusAxis
              angle={0}
              domain={[0, 100]}
              tick={{ 
                fill: '#9ca3af', 
                fontSize: 10 
              }}
              tickCount={6}
              axisLine={false}
            />
            <Radar
              name="Your Score (%)"
              dataKey="score"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.25}
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            />
            <Legend 
              wrapperStyle={{ 
                position: 'relative', 
                marginTop: '20px',
                textAlign: 'center'
              }}
              formatter={() => <span className="text-purple-600 text-sm font-semibold">Your Score (%)</span>}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="text-center mt-4 text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          📊 Complete a test to see your detailed performance breakdown across AI knowledge areas
        </div>
      </div>
    );
  }

  // Create chart data with proper structure
  const chartData = filteredScores.map((score) => ({
    subject: score.categoryName,
    score: Math.max(0, Math.min(100, Math.round(score.percentage))), // Ensure score is between 0-100
    fullMark: 100,
  }));

  console.log("Final radar chart data:", chartData);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-purple-600">
            Score: <span className="font-bold">{data.value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid 
            stroke="#e5e7eb" 
            strokeWidth={1}
            radialLines={true}
          />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ 
              fill: '#374151', 
              fontSize: 12, 
              fontWeight: 500 
            }} 
            axisLine={false}
            className="text-xs font-medium"
          />
          <PolarRadiusAxis
            angle={0}
            domain={[0, 100]}
            tick={{ 
              fill: '#9ca3af', 
              fontSize: 10 
            }}
            tickCount={6}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Your Score (%)"
            dataKey="score"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.25}
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
          />
          <Legend 
            wrapperStyle={{ 
              position: 'relative', 
              marginTop: '20px',
              textAlign: 'center'
            }}
            formatter={() => <span className="text-purple-600 text-sm font-semibold">Your Score (%)</span>}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;
