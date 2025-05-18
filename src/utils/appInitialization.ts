
import { migrateAndNotify } from './databaseMigration';
import { displaySystemCheck } from './systemCheck';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { migrateJsonDataWithNotifications } from './jsonDataMigration';

/**
 * Initializes the application with test data and verifies system integrity
 * This is a complete initialization routine that:
 * 1. Migrates categories and questions to the database
 * 2. Populates test types with questions
 * 3. Runs system checks to verify data integrity
 */
export async function initializeApplication(useJsonData = true): Promise<void> {
  try {
    toast({
      title: "Starting Application Initialization",
      description: "This will load test data and verify system setup..."
    });
    
    // Step 1: Run full migration (categories, questions, test mapping)
    if (useJsonData) {
      await migrateJsonDataWithNotifications();
    } else {
      await migrateAndNotify();
    }
    
    // Step 2: Run system check after migration completes
    setTimeout(async () => {
      await displaySystemCheck();
      
      toast({
        title: "Initialization Complete",
        description: "Application is ready to use. You can now access both Quick and Comprehensive assessments."
      });
    }, 2000); // Short delay to allow migrations to complete
    
  } catch (error) {
    console.error('Application initialization failed:', error);
    toast({
      title: "Initialization Failed",
      description: "Could not complete setup. See console for details.",
      variant: "destructive"
    });
  }
}

/**
 * Verifies if the database has been populated with questions
 * Returns true if questions exist, false otherwise
 */
export async function verifyDatabasePopulated(): Promise<boolean> {
  try {
    // Check if questions table has data
    const { count: questionsCount, error: questionsError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });
    
    if (questionsError) throw questionsError;
    
    // Check if test_questions_map table has mappings
    const { count: mappingsCount, error: mappingsError } = await supabase
      .from('test_questions_map')
      .select('*', { count: 'exact', head: true });
    
    if (mappingsError) throw mappingsError;
    
    return (questionsCount || 0) > 0 && (mappingsCount || 0) > 0;
    
  } catch (error) {
    console.error('Error verifying database population:', error);
    return false;
  }
}

/**
 * Auto-initialize application if database tables are empty
 * This can be used during application startup to ensure data exists
 */
export async function autoInitializeIfNeeded(useJsonData = true): Promise<void> {
  try {
    const isPopulated = await verifyDatabasePopulated();
    
    if (!isPopulated) {
      console.log('Database not populated, running auto-initialization...');
      await initializeApplication(useJsonData);
    } else {
      console.log('Database already populated, skipping initialization');
    }
  } catch (error) {
    console.error('Error in auto-initialization check:', error);
  }
}
