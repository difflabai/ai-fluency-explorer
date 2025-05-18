
import React from 'react';
import { Button } from "@/components/ui/button";
import { Question } from '@/utils/testData';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: boolean) => void;
  isAnswered?: boolean;
  selectedAnswer?: boolean | null;
  showFeedback?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  isAnswered = false,
  selectedAnswer = null,
  showFeedback = false
}) => {
  const handleAnswer = (answer: boolean) => {
    if (!isAnswered) {
      onAnswer(answer);
    }
  };

  const renderFeedback = () => {
    if (!showFeedback || selectedAnswer === null) return null;
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    return (
      <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        <p className="font-medium">
          {isCorrect ? 'Correct!' : 'Incorrect.'}
          {' '}The answer is {question.correctAnswer ? 'True' : 'False'}.
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md animate-scale-in">
      <div className="mb-6">
        <span className="text-xs font-semibold text-ai-purple">
          Question {question.id} • {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
        </span>
        <h3 className="text-xl font-medium mt-2">{question.text}</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => handleAnswer(true)}
          variant={selectedAnswer === true ? "default" : "outline"}
          className={`flex-1 h-14 text-lg ${
            selectedAnswer === true ? 'bg-ai-purple hover:bg-ai-purple-dark' : ''
          }`}
          disabled={isAnswered}
        >
          True
        </Button>
        
        <Button
          onClick={() => handleAnswer(false)}
          variant={selectedAnswer === false ? "default" : "outline"}
          className={`flex-1 h-14 text-lg ${
            selectedAnswer === false ? 'bg-ai-purple hover:bg-ai-purple-dark' : ''
          }`}
          disabled={isAnswered}
        >
          False
        </Button>
      </div>
      
      {renderFeedback()}
    </div>
  );
};

export default QuestionCard;
