
import { supabase } from "@/integrations/supabase/client";
import { categories, customQuickAssessmentQuestions, sampleQuestions } from "./testData";

// This is a utility script to migrate existing questions to the database
// It's meant to be run once to populate the database with initial questions

export const migrateCategoriesToDatabase = async () => {
  try {
    // Check if categories already exist to avoid duplicates
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('name');
      
    const existingCategoryNames = new Set(existingCategories?.map(c => c.name) || []);
    
    // Filter out categories that already exist
    const categoriesToInsert = categories.filter(c => !existingCategoryNames.has(c.id));
    
    if (categoriesToInsert.length === 0) {
      console.log('All categories already exist in the database');
      return true;
    }
    
    // Map categories to the database schema format
    const dbCategories = categoriesToInsert.map(c => ({
      name: c.id,
      description: c.description
    }));
    
    // Insert categories
    const { error } = await supabase
      .from('categories')
      .insert(dbCategories);
      
    if (error) {
      console.error('Error migrating categories:', error);
      return false;
    }
    
    console.log(`Successfully migrated ${dbCategories.length} categories`);
    return true;
  } catch (error) {
    console.error('Error in migrateCategoriesToDatabase:', error);
    return false;
  }
};

export const migrateQuestionsToDatabase = async () => {
  try {
    // First, get category IDs from the database
    const { data: dbCategories, error: categoryError } = await supabase
      .from('categories')
      .select('id, name');
      
    if (categoryError) {
      console.error('Error fetching categories:', categoryError);
      return false;
    }
    
    // Map category names to their database IDs
    const categoryNameToId = new Map();
    dbCategories?.forEach(c => categoryNameToId.set(c.name, c.id));
    
    // Combine all questions
    const allQuestions = [...customQuickAssessmentQuestions, ...sampleQuestions];
    
    // Check for existing questions to avoid duplicates
    const { data: existingQuestions } = await supabase
      .from('questions')
      .select('text');
      
    const existingQuestionTexts = new Set(existingQuestions?.map(q => q.text) || []);
    
    // Filter out questions that already exist
    const questionsToInsert = allQuestions.filter(q => !existingQuestionTexts.has(q.text));
    
    if (questionsToInsert.length === 0) {
      console.log('All questions already exist in the database');
      return true;
    }
    
    // Map questions to the database schema format
    const dbQuestions = questionsToInsert.map(q => {
      const categoryId = categoryNameToId.get(q.category);
      if (!categoryId) {
        console.warn(`Category ID not found for category: ${q.category}`);
        return null;
      }
      
      return {
        text: q.text,
        category_id: categoryId,
        difficulty: q.difficulty,
        correct_answer: q.correctAnswer,
        version: 1,
        is_active: true,
      };
    }).filter(Boolean); // Remove null entries
    
    // Insert questions in batches to avoid payload size limitations
    const BATCH_SIZE = 100;
    let successCount = 0;
    
    for (let i = 0; i < dbQuestions.length; i += BATCH_SIZE) {
      const batch = dbQuestions.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from('questions')
        .insert(batch);
        
      if (error) {
        console.error(`Error migrating questions batch ${i / BATCH_SIZE + 1}:`, error);
        continue;
      }
      
      successCount += batch.length;
      console.log(`Successfully migrated batch ${i / BATCH_SIZE + 1} (${batch.length} questions)`);
    }
    
    console.log(`Successfully migrated ${successCount} questions out of ${dbQuestions.length}`);
    return successCount > 0;
  } catch (error) {
    console.error('Error in migrateQuestionsToDatabase:', error);
    return false;
  }
};

export const runFullMigration = async () => {
  console.log('Starting migration...');
  
  // First migrate categories
  const categoriesSuccess = await migrateCategoriesToDatabase();
  if (!categoriesSuccess) {
    console.error('Failed to migrate categories, aborting migration');
    return false;
  }
  
  // Then migrate questions
  const questionsSuccess = await migrateQuestionsToDatabase();
  if (!questionsSuccess) {
    console.error('Failed to migrate questions');
    return false;
  }
  
  console.log('Migration completed successfully');
  return true;
};

// For development/testing purposes, you could expose this function
export const triggerMigration = () => {
  console.log('Triggering data migration...');
  runFullMigration()
    .then(success => {
      if (success) {
        console.log('✅ Migration completed successfully');
      } else {
        console.error('❌ Migration failed');
      }
    })
    .catch(err => {
      console.error('❌ Migration error:', err);
    });
};
