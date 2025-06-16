
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
      <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-3" />
      <h3 className="text-lg font-medium text-gray-700">No results yet</h3>
      <p className="text-gray-500 mt-1">Be the first to take the test and appear on the leaderboard!</p>
      <Button onClick={() => window.location.href = '/'} className="mt-4">
        Take the Test
      </Button>
    </div>
  );
};

export default EmptyState;
