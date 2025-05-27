
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, ExternalLink, Home, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { SavedTestResult } from '@/services/testResultService';

interface SharedResultHeaderProps {
  result: SavedTestResult;
  onShare: () => void;
}

const SharedResultHeader: React.FC<SharedResultHeaderProps> = ({ result, onShare }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => window.location.href = '/'} className="flex items-center gap-2 text-gray-700">
          <Home className="h-4 w-4" /> Return to Home
        </Button>
        
        <Button onClick={onShare} variant="outline" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share Result
        </Button>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-100">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <Trophy className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Fluency Assessment Results</h1>
              <p className="text-gray-600 mt-1">
                {result.username ? `Shared by ${result.username}` : 'Shared by an anonymous user'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(result.created_at), 'MMMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>Share ID: {result.share_id.slice(0, 8)}...</span>
                </div>
              </div>
            </div>
          </div>
          
          {result.is_test_data && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Test Data
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SharedResultHeader;
