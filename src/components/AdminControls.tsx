
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Loader2 } from 'lucide-react';
import { verifyDatabasePopulated } from '@/utils/appInitialization';
import { toast } from "@/hooks/use-toast";
import { DatabaseStatusCard } from './admin';
import { MigrationLogs } from './admin';
import { setupLogCapture } from './admin/controls/LogCaptureUtils';
import { MigrationPanel } from './admin/controls';

/**
 * Administrative control panel for initializing the application
 * Provides functionality to check database status and run initialization
 */
const AdminControls: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  
  // Check database status on mount
  useEffect(() => {
    checkDatabaseStatus();
  }, []);
  
  const checkDatabaseStatus = async () => {
    setIsChecking(true);
    try {
      const populated = await verifyDatabasePopulated();
      setIsInitialized(populated);
      if (populated) {
        toast({
          title: "Database Check",
          description: "Database is already populated with questions and mappings."
        });
      } else {
        toast({
          title: "Database Check",
          description: "Database is not yet populated. Please run migration."
        });
      }
    } catch (error) {
      console.error('Error checking database status:', error);
      setIsInitialized(false);
      toast({
        title: "Database Check Failed",
        description: "Could not verify database status. See console for details.",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  const setupLogCaptureWrapper = () => {
    return setupLogCapture(setMigrationLogs);
  };
  
  const handleClearLogs = () => {
    setMigrationLogs([]);
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" /> Application Data Management
        </CardTitle>
        <CardDescription>
          Initialize and verify application data
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <DatabaseStatusCard 
          isChecking={isChecking} 
          isInitialized={isInitialized} 
        />
        
        <MigrationPanel
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setMigrationLogs={setMigrationLogs}
          checkDatabaseStatus={checkDatabaseStatus}
          setupLogCapture={setupLogCaptureWrapper}
        />
        
        <MigrationLogs 
          logs={migrationLogs} 
          onClear={handleClearLogs} 
        />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={checkDatabaseStatus} 
          disabled={isChecking}
          className="flex items-center gap-2"
        >
          {isChecking && <Loader2 className="h-4 w-4 animate-spin" />}
          {isChecking ? 'Checking...' : 'Check Status'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminControls;
