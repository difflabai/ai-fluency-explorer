
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import Leaderboard from '@/components/Leaderboard';

const LeaderboardPage: React.FC = () => {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Leaderboard</h1>
        <Link to="/admin">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Admin Panel
          </Button>
        </Link>
      </div>
      <Leaderboard />
    </div>
  );
};

export default LeaderboardPage;
