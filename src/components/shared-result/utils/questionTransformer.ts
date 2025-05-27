
import { supabase } from '@/integrations/supabase/client';

// Create a mapping of category IDs to names
export const createCategoryMapping = async (): Promise<Record<string, string>> => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name');
      
    if (error) {
      console.error('Error fetching categories:', error);
      return {};
    }
    
    const mapping: Record<string, string> = {};
    categories?.forEach(category => {
      mapping[category.id.toString()] = category.name;
    });
    
    return mapping;
  } catch (error) {
    console.error('Error creating category mapping:', error);
    return {};
  }
};

// Transform questions snapshot to include proper category names and explanations
export const transformQuestionsWithCategories = async (questionsSnapshot: any[]): Promise<any[]> => {
  if (!questionsSnapshot || questionsSnapshot.length === 0) {
    return [];
  }
  
  const categoryMapping = await createCategoryMapping();
  console.log("Category mapping:", categoryMapping);
  
  // Fetch fresh explanations from the database to ensure consistency
  const questionIds = questionsSnapshot.map(q => q.dbId).filter(Boolean);
  
  let dbQuestions: Record<string, any> = {};
  
  if (questionIds.length > 0) {
    try {
      const { data: freshQuestions, error } = await supabase
        .from('questions')
        .select('id, explanation')
        .in('id', questionIds);
        
      if (!error && freshQuestions) {
        freshQuestions.forEach(q => {
          dbQuestions[q.id] = q;
        });
        console.log(`Fetched fresh explanations for ${freshQuestions.length} questions from database`);
      }
    } catch (error) {
      console.error('Error fetching fresh explanations:', error);
    }
  }
  
  return questionsSnapshot.map(question => {
    const categoryName = categoryMapping[question.category_id?.toString()] || question.category || 'Unknown Category';
    
    // Use fresh explanation from database if available, otherwise use snapshot explanation
    let explanation = '';
    const freshQuestion = question.dbId ? dbQuestions[question.dbId] : null;
    
    if (freshQuestion && freshQuestion.explanation && freshQuestion.explanation.trim().length > 0) {
      explanation = freshQuestion.explanation.trim();
      console.log(`Using fresh database explanation for question: "${question.text?.substring(0, 30)}..."`);
    } else if (question.explanation && question.explanation.trim().length > 0) {
      explanation = question.explanation.trim();
      console.log(`Using snapshot explanation for question: "${question.text?.substring(0, 30)}..."`);
    } else {
      // Fallback to default explanation if none exists
      explanation = getDefaultExplanation(question.difficulty, categoryName);
      console.log(`Using default explanation for question: "${question.text?.substring(0, 30)}..."`);
    }
    
    return {
      ...question,
      category: categoryName,
      explanation: explanation
    };
  });
};

// Provide default explanations based on difficulty and category
const getDefaultExplanation = (difficulty: string, category: string): string => {
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
};
