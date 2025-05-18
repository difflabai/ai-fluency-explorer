
import { supabase } from "@/integrations/supabase/client";
import { Category } from '@/utils/testData';

/**
 * Checks if a category exists in the database
 */
export async function categoryExists(categoryName: string): Promise<string | null> {
  const { data } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .maybeSingle();
  
  return data?.id || null;
}

/**
 * Migrates categories to the database
 */
export async function migrateCategories(categoriesToMigrate: Category[]): Promise<Map<string, string>> {
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
