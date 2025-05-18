
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { verifyDatabasePopulated, initializeApplication } from '@/utils/appInitialization';
import { migrateJsonDataWithNotifications } from '@/utils/jsonDataMigration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  const handleJsonMigration = async () => {
    setIsLoading(true);
    try {
      await migrateJsonDataWithNotifications();
      // Give time for migration to complete
      setTimeout(async () => {
        await checkDatabaseStatus();
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      console.error('Error during JSON migration:', error);
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
        
        <Tabs defaultValue="json" className="mt-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="json">JSON Migration</TabsTrigger>
            <TabsTrigger value="legacy">Legacy Migration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="json" className="space-y-4">
            <div className="text-sm">
              <p>Run the JSON-based migration to populate questions and categories from the JSON data file.</p>
              <p className="mt-1 text-muted-foreground">This is the recommended approach for stable data migrations.</p>
            </div>
            
            <Button
              onClick={handleJsonMigration}
              disabled={isLoading || isInitialized === true}
              className="w-full gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Running JSON Migration...' : 'Run JSON Migration'}
            </Button>
          </TabsContent>
          
          <TabsContent value="legacy" className="space-y-4">
            <div className="text-sm">
              <p>Run the legacy initialization process that uses in-code data.</p>
              <p className="mt-1 text-muted-foreground">This method is maintained for backward compatibility.</p>
            </div>
            
            <Button
              onClick={handleInitialize}
              disabled={isLoading || isInitialized === true}
              className="w-full gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Initializing...' : 'Initialize Application (Legacy)'}
            </Button>
          </TabsContent>
        </Tabs>
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
