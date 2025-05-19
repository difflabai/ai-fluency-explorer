
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { migrateJsonDataWithNotifications } from '@/utils/database/jsonDataOrchestrator';
import { toast } from "@/hooks/use-toast";

interface JsonMigrationProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setMigrationLogs: (logs: string[]) => void;
  checkDatabaseStatus: () => Promise<void>;
  setupLogCapture: () => () => void;
}

const JsonMigration: React.FC<JsonMigrationProps> = ({
  isLoading,
  setIsLoading,
  setMigrationLogs,
  checkDatabaseStatus,
  setupLogCapture
}) => {
  const handleJsonMigration = async () => {
    setIsLoading(true);
    setMigrationLogs([]);
    
    const restoreConsole = setupLogCapture();
    
    try {
      await migrateJsonDataWithNotifications();
      // Give time for migration to complete
      setTimeout(async () => {
        await checkDatabaseStatus();
        setIsLoading(false);
        restoreConsole();
      }, 5000);
    } catch (error) {
      console.error('Error during JSON migration:', error);
      setIsLoading(false);
      restoreConsole();
      toast({
        title: "Migration Failed",
        description: "An error occurred during JSON migration. See console for details.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleJsonMigration}
      disabled={isLoading}
      className="w-full gap-2"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading ? 'Running JSON Migration...' : 'Run JSON Migration'}
    </Button>
  );
};

export default JsonMigration;
