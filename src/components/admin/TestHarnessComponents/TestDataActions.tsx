
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Play, Trash2 } from 'lucide-react';

interface TestDataActionsProps {
  isGenerating: boolean;
  isCleaning: boolean;
  onGenerate: () => void;
  onCleanup: () => void;
}

const TestDataActions: React.FC<TestDataActionsProps> = ({
  isGenerating,
  isCleaning,
  onGenerate,
  onCleanup
}) => {
  return (
    <div className="flex justify-between border-t pt-6">
      <Button
        onClick={onCleanup}
        variant="outline"
        disabled={isCleaning || isGenerating}
        className="flex items-center gap-2 text-red-500 hover:text-red-600"
      >
        {isCleaning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        {isCleaning ? "Cleaning..." : "Remove All Test Data"}
      </Button>
      
      <Button
        onClick={onGenerate}
        disabled={isGenerating || isCleaning}
        className="flex items-center gap-2"
      >
        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        {isGenerating ? "Generating..." : "Generate Test Data"}
      </Button>
    </div>
  );
};

export default TestDataActions;
