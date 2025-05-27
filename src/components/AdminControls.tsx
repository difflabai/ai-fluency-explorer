
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
import { useAuth } from '@/contexts/auth';
import AccessDeniedAlert from './admin/AccessDeniedAlert';
import DatabaseQueryPanel from './admin/DatabaseQueryPanel';

/**
 * Administrative control panel for initializing the application
 * Provides functionality to check database status and run initialization
 */
const AdminControls: React.FC = () => {
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  // Check database status on mount
  useEffect(() => {
    if (isAdmin) {
      checkDatabaseStatus();
    }
  }, [isAdmin]);
  
  const checkDatabaseStatus = async () => {
    setIsChecking(true);
    setPermissionError(null);
    
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
    } catch (error: any) {
      console.error('Error checking database status:', error);
      setIsInitialized(false);
      
      if (error.message?.includes('permission')) {
        setPermissionError("You don't have permission to check database status.");
      }
      
      toast({
        title: "Database Check Failed",
        description: error.message || "Could not verify database status. See console for details.",
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
  
  // If user is not an admin, show access denied message
  if (!isAdmin) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Controls</CardTitle>
          <CardDescription>Manage application data and configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <AccessDeniedAlert />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Application Data Management
          </CardTitle>
          <CardDescription>
            Initialize and verify application data
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {permissionError && (
            <AccessDeniedAlert />
          )}
          
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

      <DatabaseQueryPanel />
    </div>
  );
};

export default AdminControls;
