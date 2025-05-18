
import { supabase } from "@/integrations/supabase/client";
import { Category, Question, categories, sampleQuestions, customQuickAssessmentQuestions } from '@/utils/testData';
import { toast } from "@/hooks/use-toast";

// Type definitions for migration statistics
interface MigrationStats {
  categoriesAdded: number;
  categoriesSkipped: number;
  questionsAdded: number;
  questionsSkipped: number;
  quickAssessmentCount: number;
  comprehensiveAssessmentCount: number;
}

/**
 * Checks if a category exists in the database
 */
async function categoryExists(categoryName: string): Promise<string | null> {
  const { data } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .maybeSingle();
  
  return data?.id || null;
}

/**
 * Checks if a question exists in the database
 */
async function questionExists(text: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('text', text);
    
  if (error) {
    console.error('Error checking if question exists:', error);
    return false;
  }
  
  return (count || 0) > 0;
}

/**
 * Migrates categories to the database
 */
async function migrateCategories(categoriesToMigrate: Category[]): Promise<Map<string, string>> {
  console.log(`Starting migration of ${categoriesToMigrate.length} categories...`);
  
  // Create a map to store category name -> id mapping
  const categoryMap = new Map<string, string>();
  let added = 0;
  let skipped = 0;
  
  for (const category of categoriesToMigrate) {
    // Check if category already exists
    const existingId = await categoryExists(category.name);
    
    if (existingId) {
      console.log(`Category '${category.name}' already exists with ID ${existingId}`);
      categoryMap.set(category.name, existingId);
      skipped++;
      continue;
    }
    
    // Insert the new category
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        description: category.description || `Category for ${category.name} questions`
      })
      .select('id')
      .single();
      
    if (error) {
      console.error(`Error inserting category '${category.name}':`, error);
      continue;
    }
    
    console.log(`Added category '${category.name}' with ID ${data.id}`);
    categoryMap.set(category.name, data.id);
    added++;
  }
  
  console.log(`Categories migration complete. Added: ${added}, Skipped: ${skipped}`);
  return categoryMap;
}

/**
 * Migrates questions to the database
 */
async function migrateQuestions(
  questions: Question[], 
  categoryMap: Map<string, string>
): Promise<number[]> {
  console.log('Starting migration of questions...');
  
  let totalAdded = 0;
  let totalSkipped = 0;
  
  // Group questions by category
  const questionsByCategory = new Map<string, Question[]>();
  for (const question of questions) {
    if (!questionsByCategory.has(question.category)) {
      questionsByCategory.set(question.category, []);
    }
    questionsByCategory.get(question.category)!.push(question);
  }
  
  // Process each category
  for (const [categoryName, categoryQuestions] of questionsByCategory.entries()) {
    const categoryId = categoryMap.get(categoryName);
    
    if (!categoryId) {
      console.error(`Category ID not found for '${categoryName}', skipping questions`);
      continue;
    }
    
    console.log(`Processing ${categoryQuestions.length} questions for category '${categoryName}'`);
    
    let categoryAdded = 0;
    let categorySkipped = 0;
    
    // Process each question in the category
    for (const question of categoryQuestions) {
      // Check if question already exists
      const exists = await questionExists(question.text);
      
      if (exists) {
        console.log(`Question already exists: "${question.text.substring(0, 30)}..."`);
        categorySkipped++;
        continue;
      }
      
      // Insert the question
      const { error } = await supabase
        .from('questions')
        .insert({
          text: question.text,
          category_id: categoryId,
          difficulty: question.difficulty || 'novice', // Default to novice if not specified
          correct_answer: question.correctAnswer,
          is_active: true,
          version: 1
        });
        
      if (error) {
        console.error(`Error inserting question:`, error);
        continue;
      }
      
      categoryAdded++;
    }
    
    console.log(`Category '${categoryName}' - Added: ${categoryAdded}, Skipped: ${categorySkipped}`);
    totalAdded += categoryAdded;
    totalSkipped += categorySkipped;
  }
  
  return [totalAdded, totalSkipped];
}

/**
 * Populates test types with questions
 */
async function populateTestTypes(): Promise<number[]> {
  console.log('Populating test types with questions...');
  
  try {
    // Populate Quick Assessment (limited questions)
    const { data: quickData, error: quickError } = await supabase.rpc(
      'populate_test_questions',
      { test_type_name: 'Quick Assessment', question_limit: 50 }
    );
    
    if (quickError) {
      console.error('Error populating Quick Assessment:', quickError);
      return [0, 0];
    }
    
    // Populate Comprehensive Assessment (all questions)
    const { data: compData, error: compError } = await supabase.rpc(
      'populate_test_questions',
      { test_type_name: 'Comprehensive Assessment' }
    );
    
    if (compError) {
      console.error('Error populating Comprehensive Assessment:', compError);
      return [quickData || 0, 0];
    }
    
    console.log(`Test types populated: Quick Assessment (${quickData} questions), Comprehensive Assessment (${compData} questions)`);
    return [quickData || 0, compData || 0];
  } catch (error) {
    console.error('Error in populateTestTypes:', error);
    return [0, 0];
  }
}

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
