
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
    
    return (
      <div className="mt-4 p-3 rounded-md bg-blue-100 text-blue-800">
        <p className="font-medium">
          You selected: {selectedAnswer ? 'Yes, I have done this' : 'No, I haven\'t done this yet'}
        </p>
      </div>
    );
  };

  // Get the category display name 
  const getCategoryDisplayName = () => {
    if (!question.difficulty) return 'Unknown';
    
    switch(question.difficulty) {
      case 'novice': return 'Novice';
      case 'advanced-beginner': return 'Advanced Beginner';
      case 'competent': return 'Competent';
      case 'proficient': return 'Proficient';
      case 'expert': return 'Expert';
      default: return question.difficulty && typeof question.difficulty === 'string' 
        ? question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)
        : 'Unknown';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md animate-scale-in">
      <div className="mb-6">
        <span className="text-xs font-semibold text-ai-purple">
          Question {question.id} • {getCategoryDisplayName()}
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
          Yes
        </Button>
        
        <Button
          onClick={() => handleAnswer(false)}
          variant={selectedAnswer === false ? "default" : "outline"}
          className={`flex-1 h-14 text-lg ${
            selectedAnswer === false ? 'bg-ai-purple hover:bg-ai-purple-dark' : ''
          }`}
          disabled={isAnswered}
        >
          No
        </Button>
      </div>
      
      {renderFeedback()}
    </div>
  );
};

export default QuestionCard;
