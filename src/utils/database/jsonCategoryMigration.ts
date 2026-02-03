import { supabase } from '@/integrations/supabase/client';
import questionsData from '@/data/questions.json';
import { migrateCategories } from './categoryMigration';

/**
 * Migrate categories from the JSON data source
 * @returns A map of category IDs to their database IDs
 */
export async function migrateJsonCategories(): Promise<Map<string, string>> {
  const categoryMap = new Map<string, string>();

  try {
    // Convert JSON categories to the format expected by migrateCategories
    const categories = questionsData.categories.map((category) => ({
      name: category.name,
      description: category.description || `Category for ${category.name} questions`,
      id: category.id, // Adding id field to match Category type
    }));

    // Use the existing category migration function
    return await migrateCategories(categories);
  } catch (error) {
    console.error('Error in migrateJsonCategories:', error);
    return categoryMap;
  }
}
