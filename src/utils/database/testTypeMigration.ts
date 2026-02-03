import { supabase } from '@/integrations/supabase/client';

/**
 * Populates test types with questions
 */
export async function populateTestTypes(): Promise<number[]> {
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

    return [quickData || 0, compData || 0];
  } catch (error) {
    console.error('Error in populateTestTypes:', error);
    return [0, 0];
  }
}
