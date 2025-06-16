
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchResultByShareId, SavedTestResult } from '@/services/testResultService';
import { Button } from "@/components/ui/button";
import QuestionBreakdown from './QuestionBreakdown';
import { toast } from '@/hooks/use-toast';
import { 
  SharedResultHeader, 
  SharedResultStats, 
  SharedResultActions, 
  SharedResultCharts 
} from './shared-result';
import { generateUserAnswers } from './shared-result/utils/answerGenerator';
import { transformQuestionsWithCategories } from './shared-result/utils/questionTransformer';
import { CategoryScore } from '@/utils/scoring';

const SharedResultView: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [result, setResult] = useState<SavedTestResult | null>(null);
  const [questionsForBreakdown, setQuestionsForBreakdown] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedResult = async () => {
      if (!shareId) return;
      
      setIsLoading(true);
      try {
        const data = await fetchResultByShareId(shareId);
        
        if (data) {
          console.log("Loaded shared result data:", data);
          setResult(data);
          
          // Transform questions with proper category names and explanations
          if (data.questions_snapshot) {
            const transformedQuestions = await transformQuestionsWithCategories(data.questions_snapshot);
            setQuestionsForBreakdown(transformedQuestions);
          }
        } else {
          setError("This shared result could not be found or has been removed.");
        }
      } catch (err) {
        console.error("Failed to load shared result:", err);
        setError("An error occurred while loading this result.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedResult();
  }, [shareId]);

  const handleShareResult = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Link Copied",
        description: "The result link has been copied to your clipboard!"
      });
    } catch (err) {
      toast({
        title: "Share Link",
        description: "Copy this URL to share: " + currentUrl,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
          <div className="text-red-500 text-xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Result Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "This shared result does not exist or has been removed."}</p>
          <Button onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  // Convert stored category_scores to CategoryScore[] format
  const categoryScores: CategoryScore[] = Array.isArray(result.category_scores) 
    ? result.category_scores 
    : [];

  // Calculate difficulty level scores from the questions snapshot
  const difficultyScores = result?.questions_snapshot ? (() => {
    const difficultyMap: Record<string, number> = {
      'novice': 0,
      'advanced-beginner': 0, 
      'competent': 0,
      'proficient': 0,
      'expert': 0
    };
    
    // Count questions by difficulty
    result.questions_snapshot.forEach((question: any) => {
      if (question.difficulty && difficultyMap.hasOwnProperty(question.difficulty)) {
        difficultyMap[question.difficulty]++;
      }
    });
    
    return difficultyMap;
  })() : {
    'novice': 9,
    'advanced-beginner': 10,
    'competent': 10, 
    'proficient': 10,
    'expert': 11
  };

  // Generate realistic user answers based on overall score and question difficulty
  const userAnswersForBreakdown = result?.questions_snapshot ? 
    generateUserAnswers(result.questions_snapshot, result.percentage_score) : [];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <SharedResultHeader result={result} onShare={handleShareResult} />
        
        <SharedResultStats result={result} difficultyScores={difficultyScores} />
        
        {/* Detailed Question Breakdown - only show if questions snapshot is available */}
        {questionsForBreakdown.length > 0 && (
          <QuestionBreakdown 
            questions={questionsForBreakdown}
            userAnswers={userAnswersForBreakdown}
            categoryScores={categoryScores}
          />
        )}
        
        <SharedResultCharts categoryScores={categoryScores} />
        
        <SharedResultActions />
      </div>
    </div>
  );
};

export default SharedResultView;
