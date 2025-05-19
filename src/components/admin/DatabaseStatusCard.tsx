
import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface DatabaseStatusCardProps {
  isChecking: boolean;
  isInitialized: boolean | null;
}

const DatabaseStatusCard: React.FC<DatabaseStatusCardProps> = ({ 
  isChecking, 
  isInitialized 
}) => {
  return (
    <div className="flex items-center justify-between bg-muted px-4 py-3 rounded-lg">
      <span className="font-medium">Database Status:</span>
      
      {isChecking ? (
        <div className="flex items-center text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Checking...
        </div>
      ) : isInitialized === null ? (
        <span className="text-muted-foreground">Unknown</span>
      ) : isInitialized ? (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-2" /> Initialized
        </div>
      ) : (
        <div className="flex items-center text-amber-600">
          <AlertCircle className="h-4 w-4 mr-2" /> Not Initialized
        </div>
      )}
    </div>
  );
};

export default DatabaseStatusCard;
