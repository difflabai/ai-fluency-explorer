import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/utils/testData';

/**
 * Checks if a category exists in the database using a security definer function
 */
export async function categoryExists(categoryName: string): Promise<string | null> {
  try {
    // Use our new security definer function to bypass RLS
    const { data, error } = await supabase.rpc('check_category_exists', {
      category_name: categoryName,
    });

    if (error) {
      console.error('Error checking if category exists:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error in categoryExists:', err);
    return null;
  }
}

/**
 * Migrates categories to the database using a security definer function
 */
export async function migrateCategories(
  categoriesToMigrate: Category[]
): Promise<Map<string, string>> {
  // Create a map to store category name -> id mapping
  const categoryMap = new Map<string, string>();
  let added = 0;
  let skipped = 0;

  for (const category of categoriesToMigrate) {
    try {
      // Check if category already exists using security definer function
      const existingId = await categoryExists(category.name);

      if (existingId) {
        categoryMap.set(category.name, existingId);
        skipped++;
        continue;
      }

      // Insert the new category using the security definer function
      const { data, error } = await supabase.rpc('admin_insert_category', {
        category_name: category.name,
        category_description:
          category.description || `Category for ${category.name} questions`,
      });

      if (error) {
        console.error(`Error inserting category '${category.name}':`, error);
        continue;
      }

      if (data) {
        categoryMap.set(category.name, data);
        added++;
      }
    } catch (err) {
      console.error(`Unexpected error processing category '${category.name}':`, err);
    }
  }

  return categoryMap;
}
