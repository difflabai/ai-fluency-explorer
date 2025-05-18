
import { supabase } from "@/integrations/supabase/client";
import { categories, sampleQuestions, customQuickAssessmentQuestions } from '@/utils/testData';
import { toast } from "@/hooks/use-toast";
import { migrateCategories } from "./database/categoryMigration";
import { migrateQuestions } from "./database/questionMigration";
import { populateTestTypes } from "./database/testTypeMigration";
import { MigrationStats } from "./database/migrationTypes";

/**
 * Main function to migrate all data to the database
 */
export async function migrateQuestionsToDatabase(): Promise<MigrationStats> {
  console.log('Starting database migration process...');
  
  try {
    // Step 1: Migrate categories from our predefined list
    const categoryMap = await migrateCategories(categories);
    
    // Step 2: Combine all questions for migration
    const allQuestions = [...sampleQuestions, ...customQuickAssessmentQuestions];
    
    // Step 3: Migrate questions
    const [questionsAdded, questionsSkipped] = await migrateQuestions(allQuestions, categoryMap);
    
    // Step 4: Populate test types
    const [quickCount, compCount] = await populateTestTypes();
    
    // Prepare stats to return
    const stats: MigrationStats = {
      categoriesAdded: categoryMap.size,
      categoriesSkipped: categories.length - categoryMap.size,
      questionsAdded,
      questionsSkipped,
      quickAssessmentCount: quickCount,
      comprehensiveAssessmentCount: compCount
    };
    
    console.log('Migration completed successfully:', stats);
    return stats;
    
  } catch (error) {
    console.error('Error in migration process:', error);
    throw error;
  }
}

/**
 * Helper function to migrate data and display toast notifications
 */
export async function migrateAndNotify(): Promise<void> {
  try {
    toast({
      title: "Migration Started",
      description: "Migrating test data to the database. This may take a moment..."
    });
    
    const stats = await migrateQuestionsToDatabase();
    
    toast({
      title: "Migration Successful",
      description: `Added ${stats.questionsAdded} questions across ${stats.categoriesAdded} categories. Test types populated with ${stats.quickAssessmentCount} and ${stats.comprehensiveAssessmentCount} questions.`
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
    toast({
      title: "Migration Failed",
      description: "An error occurred during migration. See console for details.",
      variant: "destructive"
    });
  }
}
