
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MigrationControlsProps {
  isLoading: boolean;
  onJsonMigration: () => void;
  onLegacyMigration: () => void;
}

const MigrationControls: React.FC<MigrationControlsProps> = ({
  isLoading,
  onJsonMigration,
  onLegacyMigration
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
        
        <Button
          onClick={onJsonMigration}
          disabled={isLoading}
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
          onClick={onLegacyMigration}
          disabled={isLoading}
          className="w-full gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Initializing...' : 'Initialize Application (Legacy)'}
        </Button>
      </TabsContent>
    </Tabs>
  );
};

export default MigrationControls;
