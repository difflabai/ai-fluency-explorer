
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabaseInitialization, JsonMigration } from './controls';

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
        
        <button
          onClick={onJsonMigration}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {isLoading ? 'Running JSON Migration...' : 'Run JSON Migration'}
        </button>
      </TabsContent>
      
      <TabsContent value="legacy" className="space-y-4">
        <div className="text-sm">
          <p>Run the legacy initialization process that uses in-code data.</p>
          <p className="mt-1 text-muted-foreground">This method is maintained for backward compatibility.</p>
        </div>
        
        <button
          onClick={onLegacyMigration}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {isLoading ? 'Initializing...' : 'Initialize Application (Legacy)'}
        </button>
      </TabsContent>
    </Tabs>
  );
};

export default MigrationControls;
