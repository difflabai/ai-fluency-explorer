
import { triggerMigration } from './migrationScript';
import { displaySystemCheck } from './systemCheck';
import { migrateQuestionsToDatabase, migrateAndNotify } from './databaseMigration';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { initializeApplication, autoInitializeIfNeeded, verifyDatabasePopulated } from './appInitialization';
import { migrateJsonData, migrateJsonDataWithNotifications } from './jsonDataMigration';

// Expose utility functions to the global window object for development use
export const setupDevUtils = () => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.devUtils = {
      migrateData: triggerMigration,
      systemCheck: displaySystemCheck,
      populateTestTypes: async () => {
        try {
          // Call our improved RPC function to populate test types with balanced distribution
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
            console.log(`✅ Populated Quick Assessment with ${quickData} questions using balanced distribution`);
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
            console.log(`✅ Populated Comprehensive Assessment with ${compData} questions using balanced distribution`);
            toast({
              title: "Success",
              description: `Test types populated with balanced distribution: ${quickData} and ${compData} questions respectively.`
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
      
      // Enhanced function to test and analyze question distribution
      analyzeQuestionDistribution: async () => {
        try {
          console.log('🔍 Analyzing current question distribution...');
          
          // Fetch questions for both test types to analyze distribution
          const { data: quickQuestions } = await supabase
            .from('test_questions_map')
            .select(`
              question_id,
              questions!inner(
                text,
                difficulty,
                category_id,
                categories!inner(name)
              )
            `)
            .eq('test_types.name', 'Quick Assessment');
            
          const { data: compQuestions } = await supabase
            .from('test_questions_map')
            .select(`
              question_id,
              questions!inner(
                text,
                difficulty,
                category_id,
                categories!inner(name)
              )
            `)
            .eq('test_types.name', 'Comprehensive Assessment');
            
          console.log('📊 Quick Assessment Distribution:', quickQuestions?.length || 0, 'questions');
          console.log('📊 Comprehensive Assessment Distribution:', compQuestions?.length || 0, 'questions');
          
          toast({
            title: "Distribution Analysis",
            description: "Check console for detailed question distribution analysis."
          });
        } catch (error) {
          console.error('Error analyzing distribution:', error);
          toast({
            title: "Analysis Failed",
            description: "Could not analyze question distribution. See console for details.",
            variant: "destructive"
          });
        }
      },
      
      migrateQuestionsToDatabase,
      runMigrationWithNotifications: migrateAndNotify,
      initializeApplication,
      verifyDatabasePopulated,
      autoInitializeIfNeeded,
      
      // Add JSON migration functions
      migrateJsonData,
      migrateJsonDataWithNotifications
    };
    
    console.log(
      '🛠️ Dev utilities available in console:\n' +
      '- window.devUtils.migrateData() - Migrate test data to the database\n' +
      '- window.devUtils.systemCheck() - Verify system setup\n' +
      '- window.devUtils.populateTestTypes() - Populate test types with BALANCED distribution\n' +
      '- window.devUtils.analyzeQuestionDistribution() - Analyze current question distribution\n' +
      '- window.devUtils.migrateQuestionsToDatabase() - Migrate and populate test questions\n' +
      '- window.devUtils.runMigrationWithNotifications() - Run migration with toast notifications\n' +
      '- window.devUtils.initializeApplication() - Complete initialization of the app (migration + system check)\n' +
      '- window.devUtils.verifyDatabasePopulated() - Check if database has been populated\n' +
      '- window.devUtils.autoInitializeIfNeeded() - Auto-initialize if database is empty\n' +
      '- window.devUtils.migrateJsonData() - Run JSON-based migration\n' +
      '- window.devUtils.migrateJsonDataWithNotifications() - Run JSON migration with toast notifications'
    );
  }
};

// Only run in development environments
if (process.env.NODE_ENV === 'development') {
  setupDevUtils();
}
