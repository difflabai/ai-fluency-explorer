
import { triggerMigration } from './migrationScript';
import { displaySystemCheck } from './systemCheck';
import { migrateQuestionsToDatabase, migrateAndNotify } from './databaseMigration';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { initializeApplication, autoInitializeIfNeeded, verifyDatabasePopulated } from './appInitialization';

// Expose utility functions to the global window object for development use
export const setupDevUtils = () => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.devUtils = {
      migrateData: triggerMigration,
      systemCheck: displaySystemCheck,
      populateTestTypes: async () => {
        try {
          // Call our RPC function to populate test types
          const { data: quickData, error: quickError } = await supabase.rpc(
            'populate_test_questions',
            { test_type_name: 'Quick Assessment', question_limit: 50 }
          );
          
          if (quickError) {
            console.error('Error populating Quick Assessment:', quickError);
            toast({
              title: "Error",
              description: "Failed to populate Quick Assessment test. See console for details.",
              variant: "destructive"
            });
          } else {
            console.log(`Populated Quick Assessment with ${quickData} questions`);
          }
          
          const { data: compData, error: compError } = await supabase.rpc(
            'populate_test_questions',
            { test_type_name: 'Comprehensive Assessment' }
          );
          
          if (compError) {
            console.error('Error populating Comprehensive Assessment:', compError);
            toast({
              title: "Error",
              description: "Failed to populate Comprehensive Assessment test. See console for details.",
              variant: "destructive"
            });
          } else {
            console.log(`Populated Comprehensive Assessment with ${compData} questions`);
            toast({
              title: "Success",
              description: `Test types populated with ${quickData} and ${compData} questions respectively.`
            });
          }
        } catch (error) {
          console.error('Error in populateTestTypes:', error);
          toast({
            title: "Error",
            description: "An unexpected error occurred. See console for details.",
            variant: "destructive"
          });
        }
      },
      migrateQuestionsToDatabase,
      runMigrationWithNotifications: migrateAndNotify,
      initializeApplication,
      verifyDatabasePopulated,
      autoInitializeIfNeeded
    };
    
    console.log(
      'Dev utilities available in console:\n' +
      '- window.devUtils.migrateData() - Migrate test data to the database\n' +
      '- window.devUtils.systemCheck() - Verify system setup\n' +
      '- window.devUtils.populateTestTypes() - Populate test types with questions\n' +
      '- window.devUtils.migrateQuestionsToDatabase() - Migrate and populate test questions\n' +
      '- window.devUtils.runMigrationWithNotifications() - Run migration with toast notifications\n' +
      '- window.devUtils.initializeApplication() - Complete initialization of the app (migration + system check)\n' +
      '- window.devUtils.verifyDatabasePopulated() - Check if database has been populated\n' +
      '- window.devUtils.autoInitializeIfNeeded() - Auto-initialize if database is empty'
    );
  }
};

// Only run in development environments
if (process.env.NODE_ENV === 'development') {
  setupDevUtils();
}
