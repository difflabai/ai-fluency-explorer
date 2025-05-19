
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { initializeApplication } from '@/utils/appInitialization';
import { toast } from "@/hooks/use-toast";

interface DatabaseInitializationProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setMigrationLogs: (logs: string[]) => void;
  checkDatabaseStatus: () => Promise<void>;
  setupLogCapture: () => () => void;
}

const DatabaseInitialization: React.FC<DatabaseInitializationProps> = ({
  isLoading,
  setIsLoading,
  setMigrationLogs,
  checkDatabaseStatus,
  setupLogCapture
}) => {
  const handleInitialize = async () => {
    setIsLoading(true);
    setMigrationLogs([]);
    
    const restoreConsole = setupLogCapture();
    
    try {
      await initializeApplication();
      // Give time for initialization to complete
      setTimeout(async () => {
        await checkDatabaseStatus();
        setIsLoading(false);
        restoreConsole();
      }, 5000);
    } catch (error) {
      console.error('Error during initialization:', error);
      setIsLoading(false);
      restoreConsole();
      toast({
        title: "Initialization Failed",
        description: "An error occurred during initialization. See console for details.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleInitialize}
      disabled={isLoading}
      className="w-full gap-2"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading ? 'Initializing...' : 'Initialize Application (Legacy)'}
    </Button>
  );
};

export default DatabaseInitialization;
