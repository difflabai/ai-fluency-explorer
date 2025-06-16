
import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, Trophy } from 'lucide-react';

const LeaderboardHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-purple-600 flex items-center gap-2">
        <Trophy className="h-8 w-8" />
        AI Fluency Leaderboard
      </h1>
      
      <Button variant="ghost" onClick={() => window.location.href = '/'} className="flex items-center gap-2">
        <Home className="h-4 w-4" />
        Return Home
      </Button>
    </div>
  );
};

export default LeaderboardHeader;
