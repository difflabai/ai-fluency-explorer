
import React from 'react';
import { Button } from "@/components/ui/button";

const SharedResultActions: React.FC = () => {
  return (
    <div className="flex justify-center gap-4">
      <Button 
        variant="outline"
        onClick={() => window.location.href = '/'} 
        className="text-purple-600 border-purple-600 hover:bg-purple-50"
      >
        Take Your Own Assessment
      </Button>
      <Button 
        onClick={() => window.location.href = '/leaderboard'} 
        className="bg-purple-500 hover:bg-purple-600 text-white"
      >
        View Leaderboard
      </Button>
    </div>
  );
};

export default SharedResultActions;
