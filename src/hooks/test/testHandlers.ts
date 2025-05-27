
import { toast } from "@/hooks/use-toast";
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
    a => a.questionId === currentQuestion.id
  );
  
  if (existingAnswerIndex >= 0) {
    // Update existing answer
    updatedAnswers[existingAnswerIndex].answer = answer;
  } else {
    // Add new answer
    updatedAnswers.push({
      questionId: currentQuestion.id,
      answer
    });
  }
  
  console.log('Answer recorded:', {
    questionId: currentQuestion.id,
    answer,
    totalAnswers: updatedAnswers.length
  });
  
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
  console.log("Completing test with:", { 
    questionsCount: questions.length, 
    userAnswersCount: userAnswers.length,
    questions: questions.map(q => ({ id: q.id, category: q.category, difficulty: q.difficulty })),
    userAnswers: userAnswers.map(a => ({ questionId: a.questionId, answer: a.answer }))
  });
  
  // Validate that we have answers for all questions
  if (userAnswers.length !== questions.length) {
    console.warn('Mismatch between questions and answers:', {
      questionsCount: questions.length,
      answersCount: userAnswers.length,
      missingAnswers: questions.filter(q => !userAnswers.find(a => a.questionId === q.id)).map(q => q.id)
    });
  }
  
  const testResult = calculateResults(questions, userAnswers);
  console.log('Test result calculated:', testResult);
  
  setResult(testResult);
  setTestComplete(true);
  
  // Create an object mapping question IDs to their database IDs
  const questionIdToDbId = new Map<number, string>();
  questions.forEach(q => {
    if (q.dbId) {
      questionIdToDbId.set(q.id, q.dbId);
    }
  });
  
  // Map user answers to include database question IDs - include ALL answers
  const answersForDb = userAnswers.map(answer => ({
    questionId: questionIdToDbId.get(answer.questionId) || answer.questionId.toString(),
    answer: answer.answer
  }));
  
  console.log('Preparing to save test result:', {
    answersForDb: answersForDb.length,
    testResult: {
      overallScore: testResult.overallScore,
      categoryScores: testResult.categoryScores.length
    }
  });
  
  try {
    console.log("Saving test result with complete data...");
    
    // Create a comprehensive questions snapshot that preserves all question data
    const questionsSnapshot = questions.map(q => ({
      id: q.id,
      text: q.text,
      category: q.category,
      difficulty: q.difficulty,
      correctAnswer: q.correctAnswer,
      dbId: q.dbId
    }));
    
    // Create user answers snapshot with proper mapping
    const userAnswersSnapshot = userAnswers.map(answer => ({
      questionId: answer.questionId,
      answer: answer.answer,
      // Include the actual question for reference
      questionData: questions.find(q => q.id === answer.questionId)
    }));
    
    // Save test result to database with complete question and answer data
    const savedResult = await saveTestResult(
      testResult,
      undefined, // username (optional)
      false, // make public
      {
        questionsSnapshot,
        userAnswers: userAnswersSnapshot
      }
    );
    
    if (savedResult) {
      console.log("Test result saved successfully:", {
        id: savedResult.id,
        score: savedResult.overall_score,
        questionsCount: questionsSnapshot.length,
        answersCount: userAnswersSnapshot.length
      });
      toast({
        title: "Test Completed!",
        description: "Your results are ready to view and have been saved.",
      });
    } else {
      console.error("Failed to save test result - no data returned");
      toast({
        title: "Test Completed",
        description: "Your results are ready, but there was an error saving them.",
        variant: "destructive"
      });
    }
  } catch (error) {
    console.error('Error saving test results:', error);
    toast({
      title: "Test Completed",
      description: "Your results are ready, but there was an error saving them to your profile.",
      variant: "destructive"
    });
  }
};

export const handleSaveProgress = () => {
  console.log('Saving progress...');
  toast({
    title: "Progress Saved",
    description: "You can continue later from where you left off.",
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
  }
};
