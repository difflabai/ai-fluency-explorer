
import { supabase } from "@/integrations/supabase/client";

export const saveUserAnswers = async (
  testResultId: string,
  answers: { questionId: string, answer: boolean }[]
) => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Prepare the answers with the user ID
    const answersWithUserId = answers.map(answer => ({
      question_id: answer.questionId,
      answer: answer.answer,
      test_result_id: testResultId,
      user_id: userId
    }));
    
    const { error } = await supabase
      .from('user_answers')
      .insert(answersWithUserId);
      
    if (error) {
      console.error('Error saving user answers:', error);
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('Error in saveUserAnswers:', error);
    return false;
  }
};
