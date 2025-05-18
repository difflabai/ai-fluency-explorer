
import { supabase } from "@/integrations/supabase/client";
import questionsData from '@/data/questions.json';

/**
 * Migrate questions from the JSON data source
 * @param categoryMap Map of category IDs to their database IDs
 * @returns Array containing [questionsAdded, questionsSkipped]
 */
export async function migrateJsonQuestions(categoryMap: Map<string, string>): Promise<number[]> {
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
    for (const [categoryId, categoryQuestions] of questionsByCategory.entries()) {
      const categoryDbId = categoryMap.get(categoryId);
      
      if (!categoryDbId) {
        console.error(`Category ID not found for '${categoryId}', skipping questions`);
        totalSkipped += categoryQuestions.length;
        continue;
      }
      
      // Get category name for logging
      let categoryName = categoryId;
      for (const category of questionsData.categories) {
        if (category.id === categoryId) {
          categoryName = category.name;
          break;
        }
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
          
          // Use the admin_insert_question function to bypass RLS
          const { data: newQuestionId, error: insertError } = await supabase
            .rpc('admin_insert_question', {
              question_text: question.text,
              category_id: categoryDbId,
              difficulty: question.difficulty || 'novice', // Default to novice if not specified
              correct_answer: question.correctAnswer
            });
            
          if (insertError) {
            console.error(`Error inserting question:`, insertError);
            categorySkipped++;
            continue;
          }
          
          console.log(`Added question with ID ${newQuestionId}`);
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
    console.error('Error in migrateJsonQuestions:', error);
    return [totalAdded, totalSkipped];
  }
}
