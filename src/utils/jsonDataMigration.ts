
import { supabase } from "@/integrations/supabase/client";
import questionsData from '@/data/questions.json';
import { toast } from "@/hooks/use-toast";
import { MigrationStats } from "./database/migrationTypes";

/**
 * Migrate categories from the JSON data source
 * @returns A map of category names to their database IDs
 */
export async function migrateCategories(): Promise<Map<string, string>> {
  console.log('Starting migration of categories from JSON data...');
  const categoryMap = new Map<string, string>();
  
  try {
    for (const category of questionsData.categories) {
      try {
        // Check if category already exists
        const { data: existingCategories, error: checkError } = await supabase
          .from('categories')
          .select('id')
          .eq('name', category.name);
          
        if (checkError) {
          console.error('Error checking if category exists:', checkError);
          continue;
        }
        
        // If category exists, map it and continue
        if (existingCategories && existingCategories.length > 0) {
          categoryMap.set(category.id, existingCategories[0].id);
          console.log(`Category '${category.name}' already exists with ID ${existingCategories[0].id}`);
          continue;
        }
        
        // Create new category
        const { data: newCategory, error: insertError } = await supabase
          .from('categories')
          .insert({
            name: category.name,
            description: category.description || `Category for ${category.name} questions`
          })
          .select('id')
          .single();
        
        if (insertError) {
          console.error(`Error creating category '${category.name}':`, insertError);
          continue;
        }
        
        if (newCategory) {
          categoryMap.set(category.id, newCategory.id);
          console.log(`Created category '${category.name}' with ID ${newCategory.id}`);
        }
      } catch (err) {
        console.error(`Unexpected error processing category '${category.name}':`, err);
      }
    }
    
    console.log(`Migrated ${categoryMap.size} categories`);
    return categoryMap;
    
  } catch (error) {
    console.error('Error in migrateCategories:', error);
    return categoryMap;
  }
}

/**
 * Migrate questions from the JSON data source
 * @param categoryMap Map of category names to their database IDs
 * @returns Array containing [questionsAdded, questionsSkipped]
 */
export async function migrateQuestions(categoryMap: Map<string, string>): Promise<number[]> {
  console.log('Starting migration of questions from JSON data...');
  
  let totalAdded = 0;
  let totalSkipped = 0;
  
  try {
    // Group questions by category for better logging
    const questionsByCategory = new Map<string, any[]>();
    for (const question of questionsData.questions) {
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
        totalSkipped += categoryQuestions.length;
        continue;
      }
      
      console.log(`Processing ${categoryQuestions.length} questions for category '${categoryName}'`);
      
      let categoryAdded = 0;
      let categorySkipped = 0;
      
      // Process each question in the category
      for (const question of categoryQuestions) {
        try {
          // Check if question already exists
          const { data: existingQuestions, error: checkError } = await supabase
            .from('questions')
            .select('id')
            .eq('text', question.text);
            
          if (checkError) {
            console.error('Error checking if question exists:', checkError);
            categorySkipped++;
            continue;
          }
          
          if (existingQuestions && existingQuestions.length > 0) {
            console.log(`Question already exists: "${question.text.substring(0, 30)}..."`);
            categorySkipped++;
            continue;
          }
          
          // Insert the question
          const { error: insertError } = await supabase
            .from('questions')
            .insert({
              text: question.text,
              category_id: categoryId,
              difficulty: question.difficulty || 'novice', // Default to novice if not specified
              correct_answer: question.correctAnswer,
              is_active: true,
              version: 1
            });
            
          if (insertError) {
            console.error(`Error inserting question:`, insertError);
            categorySkipped++;
            continue;
          }
          
          categoryAdded++;
        } catch (err) {
          console.error(`Unexpected error processing question:`, err);
          categorySkipped++;
        }
      }
      
      console.log(`Category '${categoryName}' - Added: ${categoryAdded}, Skipped: ${categorySkipped}`);
      totalAdded += categoryAdded;
      totalSkipped += categorySkipped;
    }
    
    return [totalAdded, totalSkipped];
    
  } catch (error) {
    console.error('Error in migrateQuestions:', error);
    return [totalAdded, totalSkipped];
  }
}

/**
 * Populate test types with questions
 * @returns Array containing [quickAssessmentCount, comprehensiveAssessmentCount]
 */
export async function migrateTestTypes(): Promise<number[]> {
  console.log('Starting migration of test types from JSON data...');
  
  try {
    let quickCount = 0;
    let compCount = 0;
    
    // Insert test types if they don't exist
    for (const testType of questionsData.testTypes) {
      try {
        // Check if test type exists
        const { data: existingTestTypes, error: checkError } = await supabase
          .from('test_types')
          .select('id')
          .eq('name', testType.name);
        
        if (checkError) {
          console.error(`Error checking if test type '${testType.name}' exists:`, checkError);
          continue;
        }
        
        let testTypeId: string;
        
        // Create test type if it doesn't exist
        if (!existingTestTypes || existingTestTypes.length === 0) {
          const { data: newTestType, error: insertError } = await supabase
            .from('test_types')
            .insert({
              name: testType.name,
              description: testType.description || `Test type for ${testType.name}`,
              question_limit: testType.questionLimit
            })
            .select('id')
            .single();
          
          if (insertError) {
            console.error(`Error creating test type '${testType.name}':`, insertError);
            continue;
          }
          
          if (!newTestType) {
            console.error(`Failed to create test type '${testType.name}'`);
            continue;
          }
          
          testTypeId = newTestType.id;
          console.log(`Created test type '${testType.name}' with ID ${testTypeId}`);
        } else {
          testTypeId = existingTestTypes[0].id;
          console.log(`Test type '${testType.name}' already exists with ID ${testTypeId}`);
        }
        
        // Call the database function to populate the test with questions
        const { data, error } = await supabase.rpc(
          'populate_test_questions',
          { 
            test_type_name: testType.name,
            question_limit: testType.questionLimit
          }
        );
        
        if (error) {
          console.error(`Error populating test type '${testType.name}':`, error);
          continue;
        }
        
        const questionCount = data || 0;
        
        console.log(`Populated test type '${testType.name}' with ${questionCount} questions`);
        
        // Update counts based on test type
        if (testType.name === 'Quick Assessment') {
          quickCount = questionCount;
        } else if (testType.name === 'Comprehensive Assessment') {
          compCount = questionCount;
        }
      } catch (err) {
        console.error(`Unexpected error processing test type:`, err);
      }
    }
    
    return [quickCount, compCount];
    
  } catch (error) {
    console.error('Error in migrateTestTypes:', error);
    return [0, 0];
  }
}

/**
 * Main migration function that calls the other migration functions
 * @returns Migration stats
 */
export async function migrateJsonData(): Promise<MigrationStats> {
  console.log('Starting full JSON data migration process...');
  
  try {
    // Step 1: Migrate categories
    const categoryMap = await migrateCategories();
    
    // Step 2: Migrate questions
    const [questionsAdded, questionsSkipped] = await migrateQuestions(categoryMap);
    
    // Step 3: Populate test types
    const [quickCount, compCount] = await migrateTestTypes();
    
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
