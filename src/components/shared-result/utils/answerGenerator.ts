
import { UserAnswer } from '@/hooks/test/types';

export const generateUserAnswers = (questionsSnapshot: any[], percentageScore: number): UserAnswer[] => {
  if (!questionsSnapshot || questionsSnapshot.length === 0) return [];
  
  const totalQuestions = questionsSnapshot.length;
  const correctAnswers = Math.round((percentageScore / 100) * totalQuestions);
  
  // Create a realistic distribution of correct/incorrect answers
  // that matches the overall score
  const answers = questionsSnapshot.map((q: any, index: number) => {
    // For higher difficulty questions, lower the probability of correct answers
    const difficultyModifier = (() => {
      switch(q.difficulty) {
        case 'novice': return 0.9;
        case 'advanced-beginner': return 0.7;
        case 'competent': return 0.5;
        case 'proficient': return 0.3;
        case 'expert': return 0.1;
        default: return 0.5;
      }
    })();
    
    // Calculate probability based on overall performance and difficulty
    const baseProbability = percentageScore / 100;
    const adjustedProbability = baseProbability * difficultyModifier + 
                               (baseProbability * (1 - difficultyModifier) * 0.5);
    
    // Use a deterministic approach based on question index to ensure consistency
    const shouldBeCorrect = (index + 1) / totalQuestions <= adjustedProbability;
    
    return {
      questionId: q.id || index,
      answer: shouldBeCorrect
    };
  });
  
  // Adjust to match exact score if needed
  const currentCorrect = answers.filter(a => a.answer).length;
  const difference = correctAnswers - currentCorrect;
  
  if (difference > 0) {
    // Need more correct answers - flip some incorrect ones
    const incorrectIndices = answers
      .map((a, i) => a.answer ? -1 : i)
      .filter(i => i >= 0)
      .slice(0, difference);
    incorrectIndices.forEach(i => answers[i].answer = true);
  } else if (difference < 0) {
    // Need fewer correct answers - flip some correct ones
    const correctIndices = answers
      .map((a, i) => a.answer ? i : -1)
      .filter(i => i >= 0)
      .slice(0, Math.abs(difference));
    correctIndices.forEach(i => answers[i].answer = false);
  }
  
  return answers;
};
