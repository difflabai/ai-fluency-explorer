
import React from 'react';
import { useParams } from 'react-router-dom';
import QuestionBreakdown from './QuestionBreakdown';
import { toast } from '@/hooks/use-toast';
import { 
  SharedResultHeader, 
  SharedResultStats, 
  SharedResultActions, 
  SharedResultCharts 
} from './shared-result';
import { useSharedResult } from './shared-result/hooks/useSharedResult';
import SharedResultLoader from './shared-result/SharedResultLoader';
import { calculateDifficultyScores } from './shared-result/utils/difficultyCalculator';

const SharedResultView: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  
  const {
    result,
    questionsForBreakdown,
    categoryScores,
    userAnswersForBreakdown,
    isLoading,
    error
  } = useSharedResult(shareId);

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

  // Show loading or error states
  if (isLoading || error || !result) {
    return <SharedResultLoader isLoading={isLoading} error={error} />;
  }

  // Calculate difficulty scores
  const difficultyScores = calculateDifficultyScores(result.questions_snapshot);

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
