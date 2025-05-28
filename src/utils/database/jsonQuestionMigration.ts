
import { supabase } from "@/integrations/supabase/client";
import questionsData from '@/data/questions.json';

/**
 * Migrate questions from the JSON data source with proper explanation handling
 * @param categoryMap Map of category IDs to their database IDs
 * @returns Array containing [questionsAdded, questionsSkipped]
 */
export async function migrateJsonQuestions(categoryMap: Map<string, string>): Promise<number[]> {
  console.log('Starting migration of questions from JSON data with enhanced explanation handling...');
  
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
          // Check if question already exists by text
          const { data: existingQuestions, error: checkError } = await supabase
            .from('questions')
            .select('id, explanation')
            .eq('text', question.text);
            
          if (checkError) {
            console.error('Error checking if question exists:', checkError);
            categorySkipped++;
            continue;
          }
          
          // Prepare the explanation - prioritize JSON explanation, then generate default
          const jsonExplanation = question.explanation?.trim() || '';
          const explanationToUse = jsonExplanation || 
            generateDefaultExplanation(question.difficulty, categoryName);
          
          console.log(`Processing: "${question.text.substring(0, 40)}..."`);
          console.log(`JSON explanation available: ${jsonExplanation ? 'YES' : 'NO'}`);
          console.log(`Using explanation: "${explanationToUse.substring(0, 60)}..."`);
          
          if (existingQuestions && existingQuestions.length > 0) {
            // Question exists, update with proper explanation
            const existingQuestion = existingQuestions[0];
            const existingExplanation = existingQuestion.explanation?.trim() || '';
            
            // Always update if we have a better explanation from JSON or if existing is empty/default
            const shouldUpdate = jsonExplanation || 
              !existingExplanation || 
              isDefaultExplanation(existingExplanation);
            
            if (shouldUpdate) {
              console.log(`Updating explanation for existing question ID ${existingQuestion.id}`);
              
              const { error: updateError } = await supabase
                .from('questions')
                .update({ 
                  explanation: explanationToUse,
                  updated_at: new Date().toISOString()
                })
                .eq('id', existingQuestion.id);
                
              if (updateError) {
                console.error(`Error updating question explanation:`, updateError);
                categorySkipped++;
                continue;
              }
              
              console.log(`Successfully updated explanation for question ID ${existingQuestion.id}`);
              categoryAdded++;
            } else {
              console.log(`Question already has appropriate explanation: "${question.text.substring(0, 30)}..."`);
              categorySkipped++;
            }
            continue;
          }
          
          // Question doesn't exist, insert it with proper explanation
          console.log(`Inserting new question with explanation: "${question.text.substring(0, 40)}..."`);
          
          const { data: newQuestionId, error: insertError } = await supabase
            .rpc('admin_insert_question', {
              question_text: question.text,
              category_id: categoryDbId,
              difficulty: question.difficulty || 'novice',
              correct_answer: question.correctAnswer,
              explanation_text: explanationToUse
            });
            
          if (insertError) {
            console.error(`Error inserting question:`, insertError);
            categorySkipped++;
            continue;
          }
          
          console.log(`Successfully added question with ID ${newQuestionId} and explanation`);
          categoryAdded++;
        } catch (err) {
          console.error(`Unexpected error processing question:`, err);
          categorySkipped++;
        }
      }
      
      console.log(`Category '${categoryName}' - Added/Updated: ${categoryAdded}, Skipped: ${categorySkipped}`);
      totalAdded += categoryAdded;
      totalSkipped += categorySkipped;
    }
    
    console.log(`JSON question migration completed: ${totalAdded} added/updated, ${totalSkipped} skipped`);
    return [totalAdded, totalSkipped];
    
  } catch (error) {
    console.error('Error in migrateJsonQuestions:', error);
    return [totalAdded, totalSkipped];
  }
}

/**
 * Generate a default explanation when none exists in JSON
 */
function generateDefaultExplanation(difficulty: string, category: string): string {
  const explanations: Record<string, Record<string, string>> = {
    'novice': {
      'Practical Applications': 'This foundational skill demonstrates your ability to apply AI tools in everyday scenarios, which is essential for building confidence and practical experience.',
      'Prompt Engineering': 'Understanding basic prompting techniques is crucial for getting better results from AI systems and forms the foundation for more advanced interactions.',
      'Technical Concepts': 'Grasping fundamental AI concepts helps you understand what these tools can and cannot do, leading to more realistic expectations and better usage.',
      'AI Ethics': 'Awareness of basic ethical considerations ensures responsible AI use and helps you avoid common pitfalls in AI-assisted work.'
    },
    'advanced-beginner': {
      'Practical Applications': 'Advanced application skills show you can leverage AI for more complex tasks and integrate it effectively into your workflow.',
      'Prompt Engineering': 'Refined prompting abilities allow you to get more precise and useful outputs from AI systems through better communication.',
      'Technical Concepts': 'Deeper technical understanding helps you troubleshoot issues and make informed decisions about which AI tools to use.',
      'AI Ethics': 'Enhanced ethical awareness ensures you can navigate complex situations and maintain integrity in AI-assisted work.'
    },
    'competent': {
      'Practical Applications': 'Competent application demonstrates mastery of AI tools for professional tasks and the ability to train others.',
      'Prompt Engineering': 'Advanced prompting skills enable you to handle complex, multi-step tasks and get consistently high-quality results.',
      'Technical Concepts': 'Strong technical knowledge allows you to evaluate AI capabilities and limitations for strategic decision-making.',
      'AI Ethics': 'Comprehensive ethical understanding enables you to establish guidelines and best practices for AI use in your organization.'
    },
    'proficient': {
      'Practical Applications': 'Proficient application shows expertise in leveraging AI for innovation and solving complex, domain-specific problems.',
      'Prompt Engineering': 'Expert-level prompting enables you to push the boundaries of what AI can accomplish through sophisticated interaction techniques.',
      'Technical Concepts': 'Advanced technical mastery allows you to contribute to AI strategy and implementation at an organizational level.',
      'AI Ethics': 'Advanced ethical reasoning enables you to navigate cutting-edge scenarios and contribute to policy development.'
    },
    'expert': {
      'Practical Applications': 'Expert-level application demonstrates the ability to pioneer new use cases and mentor others in advanced AI utilization.',
      'Prompt Engineering': 'Mastery of prompting techniques positions you as a thought leader capable of developing new methodologies.',
      'Technical Concepts': 'Expert technical knowledge enables you to shape the future of AI adoption and implementation strategies.',
      'AI Ethics': 'Expert ethical understanding allows you to lead discussions on AI governance and responsible innovation.'
    }
  };
  
  return explanations[difficulty]?.[category] || 
    `This ${difficulty}-level skill in ${category} demonstrates important capabilities for effective AI utilization.`;
}

/**
 * Check if an explanation appears to be a default/generic one
 */
function isDefaultExplanation(explanation: string): boolean {
  const defaultPhrases = [
    'demonstrates important capabilities',
    'This foundational skill',
    'Advanced application skills',
    'Competent application demonstrates',
    'Proficient application shows',
    'Expert-level application demonstrates'
  ];
  
  return defaultPhrases.some(phrase => explanation.includes(phrase));
}
