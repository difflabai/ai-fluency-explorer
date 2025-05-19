
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

interface MigrationLogsProps {
  logs: string[];
  onClear: () => void;
}

const MigrationLogs: React.FC<MigrationLogsProps> = ({ logs, onClear }) => {
  if (logs.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
        Migration Logs:
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3 mr-1" /> Clear
        </Button>
      </h3>
      <div className="bg-gray-100 p-3 rounded-md text-xs max-h-60 overflow-y-auto font-mono">
        {logs.map((log, index) => (
          <div key={index} className={`mb-1 ${log.startsWith('ERROR:') ? 'text-red-600' : ''}`}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MigrationLogs;
