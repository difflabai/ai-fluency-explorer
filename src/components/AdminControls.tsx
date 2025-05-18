
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { verifyDatabasePopulated, initializeApplication } from '@/utils/appInitialization';

/**
 * Administrative control panel for initializing the application
 * Provides functionality to check database status and run initialization
 */
const AdminControls: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  // Check database status on mount
  useEffect(() => {
    checkDatabaseStatus();
  }, []);
  
  const checkDatabaseStatus = async () => {
    setIsChecking(true);
    try {
      const populated = await verifyDatabasePopulated();
      setIsInitialized(populated);
    } catch (error) {
      console.error('Error checking database status:', error);
      setIsInitialized(false);
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      await initializeApplication();
      // Give time for initialization to complete
      setTimeout(async () => {
        await checkDatabaseStatus();
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      console.error('Error during initialization:', error);
      setIsLoading(false);
    }
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
        
        <Button
          onClick={handleInitialize}
          disabled={isLoading || isInitialized === true}
          className="gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Initializing...' : 'Initialize Application'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminControls;
