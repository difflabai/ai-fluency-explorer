import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/utils/testData';

/**
 * Checks if a question exists in the database
 */
export async function questionExists(text: string): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('text', text);

    if (error) {
      console.error('Error checking if question exists:', error);
      return false;
    }

    return (count || 0) > 0;
  } catch (err) {
    console.error('Unexpected error in questionExists:', err);
    return false;
  }
}

/**
 * Migrates questions to the database
 */
export async function migrateQuestions(
  questions: Question[],
  categoryMap: Map<string, string>
): Promise<number[]> {
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
      totalSkipped += categoryQuestions.length;
      continue;
    }

    let categoryAdded = 0;
    let categorySkipped = 0;

    // Process each question in the category
    for (const question of categoryQuestions) {
      try {
        // Check if question already exists
        const exists = await questionExists(question.text);

        if (exists) {
          categorySkipped++;
          continue;
        }

        // Use the admin_insert_question function to bypass RLS
        const { data: newQuestionId, error } = await supabase.rpc(
          'admin_insert_question',
          {
            question_text: question.text,
            category_id: categoryId,
            difficulty: question.difficulty || 'novice', // Default to novice if not specified
            correct_answer: question.correctAnswer,
          }
        );

        if (error) {
          console.error(`Error inserting question:`, error);
          categorySkipped++;
          continue;
        }

        categoryAdded++;
      } catch (err) {
        console.error(`Unexpected error processing question:`, err);
        categorySkipped++;
      }
    }

    totalAdded += categoryAdded;
    totalSkipped += categorySkipped;
  }

  return [totalAdded, totalSkipped];
}
