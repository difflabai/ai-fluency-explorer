
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Question } from '@/utils/testData';
import { Check, X, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

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
  const [explanationOpen, setExplanationOpen] = useState(false);

  const handleAnswer = (answer: boolean) => {
    if (!isAnswered) {
      onAnswer(answer);
    }
  };

  const renderFeedback = () => {
    if (!showFeedback || selectedAnswer === null) return null;
    
    return (
      <div className="mt-6 p-4 rounded-lg bg-blue-50 text-blue-800 border border-blue-100">
        <p className="font-medium flex items-center">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 mr-2">
            {selectedAnswer ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </span>
          You selected: {selectedAnswer ? 'Yes, I have done this' : 'No, I haven\'t done this yet'}
        </p>
      </div>
    );
  };

  // Get the category display name 
  const getCategoryDisplayName = () => {
    if (!question.difficulty) return 'Unknown';
    
    switch(String(question.difficulty)) {
      case 'novice': return 'Novice';
      case 'advanced-beginner': return 'Advanced Beginner';
      case 'competent': return 'Competent';
      case 'proficient': return 'Proficient';
      case 'expert': return 'Expert';
      default: {
        // Handle the case when difficulty is an unexpected string
        const difficultyStr = String(question.difficulty);
        return difficultyStr.charAt(0).toUpperCase() + difficultyStr.slice(1);
      }
    }
  };

  // Generate color based on difficulty
  const getDifficultyColor = () => {
    switch(String(question.difficulty)) {
      case 'novice': return 'bg-green-100 text-green-800';
      case 'advanced-beginner': return 'bg-blue-100 text-blue-800';
      case 'competent': return 'bg-purple-100 text-purple-800';
      case 'proficient': return 'bg-indigo-100 text-indigo-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-scale-in border border-gray-100">
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor()}`}>
            {getCategoryDisplayName()}
          </span>
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            {question.category}
          </span>
        </div>
        <h3 className="text-2xl font-medium text-gray-800">{question.text}</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => handleAnswer(true)}
          variant={selectedAnswer === true ? "default" : "outline"}
          className={`flex-1 h-16 text-lg transition-all ${
            selectedAnswer === true ? 'bg-ai-purple hover:bg-ai-purple-dark' : 
            'hover:bg-ai-purple-light hover:text-ai-purple hover:border-ai-purple'
          }`}
          disabled={isAnswered}
        >
          <Check className={`h-5 w-5 mr-2 ${selectedAnswer === true ? '' : 'text-green-600'}`} />
          Yes, I have done this
        </Button>
        
        <Button
          onClick={() => handleAnswer(false)}
          variant={selectedAnswer === false ? "default" : "outline"}
          className={`flex-1 h-16 text-lg transition-all ${
            selectedAnswer === false ? 'bg-ai-purple hover:bg-ai-purple-dark' : 
            'hover:bg-ai-purple-light hover:text-ai-purple hover:border-ai-purple'
          }`}
          disabled={isAnswered}
        >
          <X className={`h-5 w-5 mr-2 ${selectedAnswer === false ? '' : 'text-red-600'}`} />
          No, not yet
        </Button>
      </div>
      
      {renderFeedback()}
      
      {/* Educational Explanation Section */}
      {question.explanation && (
        <div className="mt-6">
          <Collapsible open={explanationOpen} onOpenChange={setExplanationOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-700">Why this matters</span>
              </div>
              {explanationOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
