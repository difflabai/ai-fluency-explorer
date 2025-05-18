
import { MigrationStats } from "./migrationTypes";
import { migrateJsonCategories } from "./jsonCategoryMigration";
import { migrateJsonQuestions } from "./jsonQuestionMigration";
import { migrateJsonTestTypes } from "./jsonTestTypeMigration";
import questionsData from '@/data/questions.json';
import { toast } from "@/hooks/use-toast";

/**
 * Main migration function that calls the other migration functions
 * @returns Migration stats
 */
export async function migrateJsonData(): Promise<MigrationStats> {
  console.log('Starting full JSON data migration process...');
  
  try {
    // Step 1: Migrate categories
    const categoryMap = await migrateJsonCategories();
    
    // Step 2: Migrate questions
    const [questionsAdded, questionsSkipped] = await migrateJsonQuestions(categoryMap);
    
    // Step 3: Populate test types
    const [quickCount, compCount] = await migrateJsonTestTypes();
    
    // Prepare stats to return
    const stats: MigrationStats = {
      categoriesAdded: categoryMap.size,
      categoriesSkipped: questionsData.categories.length - categoryMap.size,
      questionsAdded,
      questionsSkipped,
      quickAssessmentCount: quickCount,
      comprehensiveAssessmentCount: compCount
    };
    
    console.log('JSON data migration completed successfully:', stats);
    return stats;
    
  } catch (error) {
    console.error('Error in full JSON data migration process:', error);
    throw error;
  }
}

/**
 * Run migration and show toast notifications
 */
export async function migrateJsonDataWithNotifications(): Promise<void> {
  try {
    toast({
      title: "Migration Started",
      description: "Migrating JSON data to the database. This may take a moment..."
    });
    
    const stats = await migrateJsonData();
    
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
