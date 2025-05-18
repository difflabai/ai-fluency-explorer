
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TestResult } from '@/utils/scoring';
import { Share, Check, Copy, Trophy, Users } from 'lucide-react';
import { saveTestResult, SavedTestResult } from '@/services/testResultService';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShareResultsProps {
  result: TestResult;
}

const ShareResults: React.FC<ShareResultsProps> = ({ result }) => {
  const [username, setUsername] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedResult, setSavedResult] = useState<SavedTestResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [session, setSession] = useState(null);

  // Check for authentication session
  React.useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saved = await saveTestResult(result, username, isPublic);
      if (saved) {
        setSavedResult(saved);
        toast({
          title: "Result saved!",
          description: isPublic 
            ? "Your result is now visible on the leaderboard." 
            : "You can share your result using the link below.",
        });
      }
    } catch (error) {
      toast({
        title: "Error saving result",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (!savedResult) return;
    
    const shareUrl = `${window.location.origin}/shared/${savedResult.share_id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends and colleagues.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const shareableLink = savedResult 
    ? `${window.location.origin}/shared/${savedResult.share_id}`
    : '';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <Share className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-medium">Share Your Results</h3>
      </div>
      
      {!savedResult ? (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Display Name (Optional)</Label>
              <Input 
                id="username" 
                placeholder="Enter your name or username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="public" 
                checked={isPublic} 
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Show on public leaderboard
              </Label>
            </div>
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="gap-2"
          >
            <Trophy className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save My Result"}
          </Button>
        </>
      ) : (
        <>
          <div className="bg-purple-50 p-4 rounded-md border border-purple-100 text-center">
            <p className="text-sm text-gray-600 mb-2">Your result has been saved! Share this link:</p>
            <div className="flex gap-2">
              <Input 
                value={shareableLink} 
                readOnly 
                className="text-sm"
              />
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {isPublic && (
            <div className="text-center text-sm text-gray-600 mt-1">
              <p>Your result is also visible on the <a href="/leaderboard" className="text-purple-600 hover:underline">public leaderboard</a>.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShareResults;
