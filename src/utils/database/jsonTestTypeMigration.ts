import { supabase } from '@/integrations/supabase/client';
import questionsData from '@/data/questions.json';

/**
 * Populate test types with questions from JSON data
 * @returns Array containing [quickAssessmentCount, comprehensiveAssessmentCount]
 */
export async function migrateJsonTestTypes(): Promise<number[]> {
  console.log('Starting migration of test types from JSON data...');

  try {
    const testCounts: { [key: string]: number } = {};

    // Insert test types if they don't exist
    for (const testType of questionsData.testTypes) {
      try {
        // Check if test type exists
        const { data: existingTestTypes, error: checkError } = await supabase
          .from('test_types')
          .select('id')
          .eq('name', testType.name);

        if (checkError) {
          console.error(
            `Error checking if test type '${testType.name}' exists:`,
            checkError
          );
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
              question_limit: testType.questionLimit,
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
          console.log(
            `Test type '${testType.name}' already exists with ID ${testTypeId}`
          );
        }

        // Call the database function to populate the test with questions
        const { data, error } = await supabase.rpc('populate_test_questions', {
          test_type_name: testType.name,
          question_limit: testType.questionLimit,
        });

        if (error) {
          console.error(`Error populating test type '${testType.name}':`, error);
          continue;
        }

        const questionCount = data || 0;
        testCounts[testType.name] = questionCount;

        console.log(
          `Populated test type '${testType.name}' with ${questionCount} questions`
        );
      } catch (err) {
        console.error(`Unexpected error processing test type:`, err);
      }
    }

    // Return counts for specific test types
    return [
      testCounts['Quick Assessment'] || 0,
      testCounts['Comprehensive Assessment'] || 0,
    ];
  } catch (error) {
    console.error('Error in migrateJsonTestTypes:', error);
    return [0, 0];
  }
}
