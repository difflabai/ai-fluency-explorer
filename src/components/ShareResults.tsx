
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Check, Twitter, Linkedin, Facebook } from 'lucide-react';
import { TestResult } from '@/utils/scoring';

interface ShareResultsProps {
  result: TestResult;
}

const ShareResults: React.FC<ShareResultsProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  
  const shareMessage = 
    `I just scored ${result.overallScore} on the AI Fluency Test, placing me at the "${result.tier.name}" level! Test your AI knowledge too!`;
  
  const shareUrl = window.location.origin;
  
  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareMessage)}`, '_blank');
  };
  
  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`, '_blank');
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareMessage}\n\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Share2 className="h-5 w-5" /> Share Your Results
      </h3>
      
      <div className="mb-5">
        <p className="text-sm text-muted-foreground mb-2">Share your AI fluency level with your network:</p>
        <div className="p-3 bg-muted rounded-md text-sm">{shareMessage}</div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Link"}
        </Button>
        
        <Button onClick={shareTwitter} variant="outline" className="flex items-center gap-2">
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        
        <Button onClick={shareLinkedIn} variant="outline" className="flex items-center gap-2">
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
        
        <Button onClick={shareFacebook} variant="outline" className="flex items-center gap-2">
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
      </div>
    </div>
  );
};

export default ShareResults;
