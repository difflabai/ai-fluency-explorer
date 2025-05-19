
import { Question, UserAnswer } from './types';

export const calculateTestMetrics = (
  questions: Question[],
  userAnswers: UserAnswer[],
  currentQuestion: Question | undefined,
  currentQuestionIndex: number
) => {
  return {
    progress: (userAnswers.length / questions.length) * 100,
    currentAnswer: userAnswers.find(a => a.questionId === currentQuestion?.id)?.answer,
    isAnswered: userAnswers.some(a => a.questionId === currentQuestion?.id),
    isLastQuestion: currentQuestionIndex === questions.length - 1,
    unansweredCount: questions.length - userAnswers.length
  };
};
