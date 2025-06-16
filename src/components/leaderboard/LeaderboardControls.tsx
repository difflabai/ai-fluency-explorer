
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Database } from 'lucide-react';

interface LeaderboardControlsProps {
  showTestData: boolean;
  setShowTestData: (show: boolean) => void;
}

const LeaderboardControls: React.FC<LeaderboardControlsProps> = ({
  showTestData,
  setShowTestData
}) => {
  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">Display Controls</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="test-data-toggle"
          checked={showTestData}
          onCheckedChange={setShowTestData}
        />
        <Label htmlFor="test-data-toggle" className="text-sm">Show Test Data</Label>
      </div>
    </div>
  );
};

export default LeaderboardControls;
