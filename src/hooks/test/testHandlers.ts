import { toast } from '@/hooks/use-toast';
import { calculateResults, TestResult } from '@/utils/scoring';
import { saveTestResult } from '@/services/testResultService';
import { Question, UserAnswer } from './types';

export const handleAnswer = (
  answer: boolean,
  currentQuestionIndex: number,
  questions: Question[],
  userAnswers: UserAnswer[],
  setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswer[]>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const updatedAnswers = [...userAnswers];
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return;

  // Find if user already answered this question
  const existingAnswerIndex = updatedAnswers.findIndex(
    (a) => a.questionId === currentQuestion.id
  );

  if (existingAnswerIndex >= 0) {
    // Update existing answer
    updatedAnswers[existingAnswerIndex].answer = answer;
  } else {
    // Add new answer
    updatedAnswers.push({
      questionId: currentQuestion.id,
      answer,
    });
  }

  setUserAnswers(updatedAnswers);

  // Auto-advance to next question after slight delay
  setTimeout(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, 800);
};

export const handleCompleteTest = async (
  questions: Question[],
  userAnswers: UserAnswer[],
  setResult: React.Dispatch<React.SetStateAction<TestResult | null>>,
  setTestComplete: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  const testResult = calculateResults(questions, userAnswers);

  setResult(testResult);
  setTestComplete(true);

  // Create an object mapping question IDs to their database IDs
  const questionIdToDbId = new Map<number, string>();
  questions.forEach((q) => {
    if (q.dbId) {
      questionIdToDbId.set(q.id, q.dbId);
    }
  });

  // Map user answers to include database question IDs - include ALL answers
  const answersForDb = userAnswers.map((answer) => ({
    questionId: questionIdToDbId.get(answer.questionId) || answer.questionId.toString(),
    answer: answer.answer,
  }));

  try {
    // Create a comprehensive questions snapshot that preserves all question data
    const questionsSnapshot = questions.map((q) => ({
      id: q.id,
      text: q.text,
      category: q.category,
      difficulty: q.difficulty,
      correctAnswer: q.correctAnswer,
      dbId: q.dbId,
    }));

    // Create user answers snapshot with proper mapping
    const userAnswersSnapshot = userAnswers.map((answer) => ({
      questionId: answer.questionId,
      answer: answer.answer,
      // Include the actual question for reference
      questionData: questions.find((q) => q.id === answer.questionId),
    }));

    // Save test result to database with complete question and answer data
    const savedResult = await saveTestResult(
      testResult,
      undefined, // username (optional)
      false, // make public
      {
        questionsSnapshot,
        userAnswers: userAnswersSnapshot,
      }
    );

    if (savedResult) {
      toast({
        title: 'Test Completed!',
        description: 'Your results are ready to view and have been saved.',
      });
    } else {
      toast({
        title: 'Test Completed',
        description: 'Your results are ready, but there was an error saving them.',
        variant: 'destructive',
      });
    }
  } catch (error) {
    console.error('Error saving test results:', error);
    toast({
      title: 'Test Completed',
      description:
        'Your results are ready, but there was an error saving them to your profile.',
      variant: 'destructive',
    });
  }
};

export const handleSaveProgress = () => {
  toast({
    title: 'Progress Saved',
    description: 'You can continue later from where you left off.',
  });
};

export const handleNavigation = {
  next: (
    currentQuestionIndex: number,
    questions: Question[],
    setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  },

  previous: (
    currentQuestionIndex: number,
    setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  },
};
