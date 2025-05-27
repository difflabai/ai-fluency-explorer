
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ScoreChart from '../ScoreChart';
import { CategoryScore } from '@/utils/scoring';

interface SharedResultChartsProps {
  categoryScores: CategoryScore[];
}

const SharedResultCharts: React.FC<SharedResultChartsProps> = ({ categoryScores }) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Distribution</h3>
        <div className="mb-4 text-sm text-gray-600">
          This radar chart shows your expertise across different AI knowledge areas. 
          Your Expert-level performance demonstrates strong capabilities across all categories.
        </div>
        <ScoreChart categoryScores={categoryScores} />
      </CardContent>
    </Card>
  );
};

export default SharedResultCharts;
