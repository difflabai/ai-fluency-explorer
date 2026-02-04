import { supabase } from '@/integrations/supabase/client';
import { DBQuestion } from './types/questionTypes';

// Curated question texts for Quick Start assessment (order matters!)
// These are hand-picked to provide a balanced intro experience:
// - 4 Practical Applications (novice)
// - 2 Prompt Engineering (novice + advanced-beginner)
// - 3 Technical Concepts (novice)
// - 1 AI Ethics (competent - most accessible ethics question)
const QUICK_START_QUESTIONS = [
  "I've used at least three different AI chat tools and can compare their relative strengths",
  'I regularly edit and personalize AI-generated text rather than using it verbatim',
  "I've experimented with different phrasings of the same question to improve AI responses",
  "I've caught an AI confidently stating something false and know how to reduce these hallucinations",
  "I've identified at least three tasks in my regular routine that AI tools help me complete faster",
  "I deliberately use AI as a brainstorming partner to generate ideas I wouldn't have thought of alone",
  'I understand that tokens are the basic units processed by AI models and impact pricing',
  'I understand that AI works by predicting text patterns rather than truly reasoning or understanding',
  "I've developed a personal set of preferences for how I like AI to format its responses to me",
  "I've asked AI to help me understand opposing viewpoints on a topic I'm exploring",
];

export const fetchQuestions = async (
  testType?: 'quick' | 'comprehensive' | 'quickstart'
): Promise<DBQuestion[]> => {
  try {
    if (!testType) {
      // If no test type is specified, fetch all active questions
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true);

      if (error) {
        return [];
      }

      return data || [];
    }

    // Quick Start uses curated questions - fetch them by matching text
    if (testType === 'quickstart') {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .in('text', QUICK_START_QUESTIONS)
        .eq('is_active', true);

      if (error || !data || data.length === 0) {
        // Fallback: if questions not found in DB, just get first 10 active questions
        const { data: fallbackData } = await supabase
          .from('questions')
          .select('*')
          .eq('is_active', true)
          .limit(10);
        return fallbackData || [];
      }

      // Return in the curated order
      const questionMap = new Map(data.map((q) => [q.text, q]));
      return QUICK_START_QUESTIONS.map((text) => questionMap.get(text)).filter(
        (q): q is DBQuestion => q !== undefined
      );
    }

    // Map the frontend test type to database test type name
    const testTypeMap: Record<string, string> = {
      quick: 'Quick Assessment',
      comprehensive: 'Comprehensive Assessment',
    };
    const testTypeName = testTypeMap[testType] || 'Quick Assessment';

    // Get test type ID
    const { data: testTypeData, error: testTypeError } = await supabase
      .from('test_types')
      .select('id, name, question_limit')
      .eq('name', testTypeName)
      .eq('is_active', true)
      .single();

    if (testTypeError || !testTypeData) {
      // Fallback to all active questions if test type not found
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .limit(testType === 'quick' ? 50 : 240);

      if (fallbackError) {
        return [];
      }

      return fallbackData || [];
    }

    // Get questions linked to this test type
    const { data: mappingData, error: mappingError } = await supabase
      .from('test_questions_map')
      .select('question_id')
      .eq('test_type_id', testTypeData.id);

    if (mappingError) {
      // Fallback to direct question fetch with limit
      const { data: directData, error: directError } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .limit(testTypeData.question_limit || (testType === 'quick' ? 50 : 240));

      if (directError) {
        return [];
      }

      return directData || [];
    }

    if (!mappingData || mappingData.length === 0) {
      // Try to populate the test questions if mapping is empty
      try {
        const { error: populateError } = await supabase.rpc('populate_test_questions', {
          test_type_name: testTypeName,
          question_limit: testTypeData.question_limit,
        });

        if (!populateError) {
          // Retry fetching mappings
          const { data: retryMappingData, error: retryMappingError } = await supabase
            .from('test_questions_map')
            .select('question_id')
            .eq('test_type_id', testTypeData.id);

          if (!retryMappingError && retryMappingData && retryMappingData.length > 0) {
            const questionIds = retryMappingData.map((mapping) => mapping.question_id);

            const { data: questions, error: questionError } = await supabase
              .from('questions')
              .select('*')
              .in('id', questionIds)
              .eq('is_active', true);

            if (!questionError && questions) {
              return questions;
            }
          }
        }
      } catch {
        // Silent fallback
      }

      // Final fallback - get questions directly with appropriate limit
      const { data: finalFallbackData, error: finalFallbackError } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .limit(testTypeData.question_limit || (testType === 'quick' ? 50 : 240));

      if (finalFallbackError) {
        return [];
      }

      return finalFallbackData || [];
    }

    // Get the actual question data using the mappings
    const questionIds = mappingData.map((mapping) => mapping.question_id);

    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .in('id', questionIds)
      .eq('is_active', true);

    if (questionError || !questions) {
      return [];
    }

    return questions;
  } catch {
    return [];
  }
};
