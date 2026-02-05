import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { CategoryScore } from '@/utils/scoring';

interface ScoreChartProps {
  categoryScores: CategoryScore[];
}

const ScoreChart: React.FC<ScoreChartProps> = ({ categoryScores }) => {
  // Mapping from full category names to abbreviated display names for the chart
  const categoryDisplayNames: Record<string, string> = {
    'Prompt Engineering': 'Prompting',
    'AI Ethics': 'Ethics',
    'Technical Concepts': 'Technical',
    'Practical Applications': 'Practical',
  };

  // Create chart data - always show all 4 categories even if no data
  const chartData = [
    {
      subject: 'Prompting',
      fullName: 'Prompt Engineering',
      score: 0,
      fullMark: 100,
    },
    {
      subject: 'Ethics',
      fullName: 'AI Ethics',
      score: 0,
      fullMark: 100,
    },
    {
      subject: 'Technical',
      fullName: 'Technical Concepts',
      score: 0,
      fullMark: 100,
    },
    {
      subject: 'Practical',
      fullName: 'Practical Applications',
      score: 0,
      fullMark: 100,
    },
  ];

  // Update with actual scores if available
  if (categoryScores && categoryScores.length > 0) {
    categoryScores.forEach((score) => {
      // Map full category name to abbreviated display name
      const displayName = categoryDisplayNames[score.categoryName];
      const chartItem = chartData.find(
        (item) => item.subject === displayName || item.fullName === score.categoryName
      );
      if (chartItem) {
        // Use the actual percentage, ensuring it's properly rounded and within bounds
        chartItem.score = Math.max(0, Math.min(100, score.percentage));
      }
    });
  }

  // Custom tooltip component - shows full category name on hover
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const fullName = data.payload?.fullName || data.name;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{fullName}</p>
          <p className="text-purple-600">
            Score: <span className="font-bold">{Math.round(data.value)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={chartData}
          margin={{ top: 30, right: 50, bottom: 30, left: 50 }}
          cx="50%"
          cy="50%"
          outerRadius="65%"
        >
          <PolarGrid stroke="#e5e7eb" strokeWidth={1} radialLines={true} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: '#374151',
              fontSize: 12,
              fontWeight: 500,
            }}
            tickLine={false}
            axisLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: '#9ca3af',
              fontSize: 10,
            }}
            tickCount={5}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Your Score (%)"
            dataKey="score"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.25}
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
            }}
            formatter={() => (
              <span className="text-purple-600 text-sm font-semibold">
                Your Score (%)
              </span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Show message if no real data */}
      {(!categoryScores || categoryScores.length === 0) && (
        <div className="text-center mt-4 text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          📊 Complete a test to see your detailed performance breakdown across AI
          knowledge areas
        </div>
      )}
    </div>
  );
};

export default ScoreChart;
