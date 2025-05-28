
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
  console.log('Starting comprehensive JSON data migration process...');
  
  try {
    // Step 1: Migrate categories
    console.log('Step 1: Migrating categories...');
    const categoryMap = await migrateJsonCategories();
    
    // Step 2: Migrate questions with enhanced explanation handling
    console.log('Step 2: Migrating questions with enhanced explanation handling...');
    const [questionsAdded, questionsSkipped] = await migrateJsonQuestions(categoryMap);
    
    // Step 3: Populate test types
    console.log('Step 3: Populating test types...');
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
    
    console.log('Comprehensive JSON data migration completed successfully:', stats);
    return stats;
    
  } catch (error) {
    console.error('Error in comprehensive JSON data migration process:', error);
    throw error;
  }
}

/**
 * Run migration and show detailed toast notifications
 */
export async function migrateJsonDataWithNotifications(): Promise<void> {
  try {
    toast({
      title: "Migration Started",
      description: "Migrating JSON data with enhanced explanation handling. This may take a moment..."
    });
    
    const stats = await migrateJsonData();
    
    toast({
      title: "Migration Successful",
      description: `Enhanced migration completed! Added/updated ${stats.questionsAdded} questions with proper explanations across ${stats.categoriesAdded} categories. Test types populated with ${stats.quickAssessmentCount} and ${stats.comprehensiveAssessmentCount} questions.`
    });
    
    // Additional notification about explanations
    toast({
      title: "Explanations Updated",
      description: "All questions now have rich, context-specific explanations from the JSON data source.",
    });
    
  } catch (error) {
    console.error('Enhanced migration failed:', error);
    toast({
      title: "Migration Failed",
      description: "An error occurred during enhanced migration. See console for details.",
      variant: "destructive"
    });
  }
}
