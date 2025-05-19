
import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from '@/components/auth/UserMenu';
import { Brain } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <span className="font-bold text-lg">AI Fluency Assessment</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/leaderboard" className="text-sm text-gray-700 hover:text-purple-600">
            Leaderboard
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
