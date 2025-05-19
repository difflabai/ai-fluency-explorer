
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JsonMigration from './JsonMigration';
import DatabaseInitialization from './DatabaseInitialization';

interface MigrationPanelProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setMigrationLogs: (logs: string[]) => void;
  checkDatabaseStatus: () => Promise<void>;
  setupLogCapture: () => () => void;
}

const MigrationPanel: React.FC<MigrationPanelProps> = ({
  isLoading,
  setIsLoading,
  setMigrationLogs,
  checkDatabaseStatus,
  setupLogCapture
}) => {
  return (
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
        
        <JsonMigration 
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setMigrationLogs={setMigrationLogs}
          checkDatabaseStatus={checkDatabaseStatus}
          setupLogCapture={setupLogCapture}
        />
      </TabsContent>
      
      <TabsContent value="legacy" className="space-y-4">
        <div className="text-sm">
          <p>Run the legacy initialization process that uses in-code data.</p>
          <p className="mt-1 text-muted-foreground">This method is maintained for backward compatibility.</p>
        </div>
        
        <DatabaseInitialization 
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setMigrationLogs={setMigrationLogs}
          checkDatabaseStatus={checkDatabaseStatus}
          setupLogCapture={setupLogCapture}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MigrationPanel;
