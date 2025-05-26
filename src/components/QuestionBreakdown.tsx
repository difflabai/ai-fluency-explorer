
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { Question, UserAnswer } from '@/hooks/test/types';

interface QuestionBreakdownProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  categoryScores: any[];
}

const QuestionBreakdown: React.FC<QuestionBreakdownProps> = ({ 
  questions, 
  userAnswers, 
  categoryScores 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  // Group questions by category
  const questionsByCategory = questions.reduce((acc, question) => {
    const categoryName = question.category || 'Unknown Category';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  // Group questions by difficulty
  const questionsByDifficulty = questions.reduce((acc, question) => {
    const difficulty = question.difficulty || 'unknown';
    if (!acc[difficulty]) {
      acc[difficulty] = [];
    }
    acc[difficulty].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  const getUserAnswer = (questionId: number) => {
    return userAnswers.find(answer => answer.questionId === questionId);
  };

  const formatDifficultyName = (difficulty: string) => {
    switch(difficulty) {
      case 'novice': return 'Novice';
      case 'advanced-beginner': return 'Advanced Beginner';
      case 'competent': return 'Competent';
      case 'proficient': return 'Proficient';
      case 'expert': return 'Expert';
      default: return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'novice': return 'bg-green-100 text-green-800';
      case 'advanced-beginner': return 'bg-blue-100 text-blue-800';
      case 'competent': return 'bg-yellow-100 text-yellow-800';
      case 'proficient': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const QuestionItem: React.FC<{ question: Question }> = ({ question }) => {
    const userAnswer = getUserAnswer(question.id);
    const isCorrect = userAnswer?.answer === true;
    
    return (
      <div className="border rounded-lg p-4 mb-3 bg-white">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-sm text-gray-800 mb-2">{question.text}</p>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty || '')}`}>
                {formatDifficultyName(question.difficulty || '')}
              </span>
              {question.category && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {question.category}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {userAnswer ? (
              <div className="flex items-center gap-1">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {userAnswer.answer ? 'Yes' : 'No'}
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">Not answered</span>
            )}
          </div>
        </div>
        
        {showAnswers && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-sm">
              <span className="font-medium text-gray-600">Expected: </span>
              <span className={`font-medium ${question.correct_answer ? 'text-green-600' : 'text-red-600'}`}>
                {question.correct_answer ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isExpanded) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Detailed Question Breakdown</h3>
              <p className="text-gray-600">View your performance on individual questions by category and difficulty</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2"
            >
              <ChevronDown className="h-4 w-4" />
              Show Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Detailed Question Breakdown</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center gap-1"
            >
              {showAnswers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showAnswers ? 'Hide' : 'Show'} Answers
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="flex items-center gap-1"
            >
              <ChevronUp className="h-4 w-4" />
              Hide
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* By Difficulty Level */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Questions by Difficulty Level</h4>
          {Object.entries(questionsByDifficulty).map(([difficulty, difficultyQuestions]) => {
            const correctCount = difficultyQuestions.filter(q => {
              const userAnswer = getUserAnswer(q.id);
              return userAnswer?.answer === true;
            }).length;
            
            return (
              <div key={difficulty} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-700">{formatDifficultyName(difficulty)}</h5>
                  <span className="text-sm text-gray-600">
                    {correctCount}/{difficultyQuestions.length} correct ({Math.round((correctCount/difficultyQuestions.length) * 100)}%)
                  </span>
                </div>
                <div className="space-y-2">
                  {difficultyQuestions.map(question => (
                    <QuestionItem key={question.id} question={question} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* By Category */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Questions by Category</h4>
          {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => {
            const correctCount = categoryQuestions.filter(q => {
              const userAnswer = getUserAnswer(q.id);
              return userAnswer?.answer === true;
            }).length;
            
            return (
              <div key={category} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-700">{category}</h5>
                  <span className="text-sm text-gray-600">
                    {correctCount}/{categoryQuestions.length} correct ({Math.round((correctCount/categoryQuestions.length) * 100)}%)
                  </span>
                </div>
                <div className="space-y-2">
                  {categoryQuestions.map(question => (
                    <QuestionItem key={question.id} question={question} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionBreakdown;
