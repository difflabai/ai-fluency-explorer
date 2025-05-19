import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Database, Play, Loader2, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from '@/hooks/use-toast';
import { generateTestData, cleanupTestData } from '@/utils/testData';
import type { TestDataConfig } from '@/utils/testData';

const TestHarness: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [showConfigAdvanced, setShowConfigAdvanced] = useState(false);
  const [config, setConfig] = useState<TestDataConfig>({
    count: 10,
    scoreDistribution: 'random',
    usernamePattern: 'TestUser_',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    },
    minScore: 20,
    maxScore: 100
  });

  const handleGenerateTestData = async () => {
    setIsGenerating(true);
    try {
      const result = await generateTestData(config);
      setGeneratedCount(result.count);
      toast({
        title: "Test Data Generated",
        description: `Successfully created ${result.count} test results.`
      });
    } catch (error) {
      console.error('Error generating test data:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate test data. See console for details.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCleanupTestData = async () => {
    setIsCleaning(true);
    try {
      const result = await cleanupTestData();
      toast({
        title: "Test Data Cleaned",
        description: `Successfully removed ${result.count} test results.`
      });
      setGeneratedCount(0);
    } catch (error) {
      console.error('Error cleaning test data:', error);
      toast({
        title: "Cleanup Failed",
        description: "Failed to clean test data. See console for details.",
        variant: "destructive"
      });
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" /> Test Data Generator
        </CardTitle>
        <CardDescription>
          Generate synthetic test data for development and testing purposes
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Generated test data is only visible to admin users and will not appear in public leaderboards.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="count">Number of Test Results</Label>
              <div className="flex items-center gap-4">
                <Slider 
                  id="count"
                  min={1} 
                  max={100} 
                  step={1}
                  value={[config.count]}
                  onValueChange={(values) => setConfig({...config, count: values[0]})}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={1}
                  max={100}
                  className="w-16"
                  value={config.count}
                  onChange={(e) => setConfig({...config, count: parseInt(e.target.value) || 1})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distribution">Score Distribution</Label>
              <Select
                value={config.scoreDistribution}
                onValueChange={(value: 'random' | 'fixed' | 'gaussian') => 
                  setConfig({...config, scoreDistribution: value})
                }
              >
                <SelectTrigger id="distribution">
                  <SelectValue placeholder="Distribution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="random">Random</SelectItem>
                    <SelectItem value="fixed">Fixed Range</SelectItem>
                    <SelectItem value="gaussian">Bell Curve</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username-pattern">Username Pattern</Label>
            <Input
              id="username-pattern"
              value={config.usernamePattern}
              onChange={(e) => setConfig({...config, usernamePattern: e.target.value})}
              placeholder="TestUser_"
            />
            <p className="text-xs text-muted-foreground">
              Test usernames will be this pattern followed by a number
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="advanced-config"
              checked={showConfigAdvanced}
              onCheckedChange={setShowConfigAdvanced}
            />
            <Label htmlFor="advanced-config">Show advanced configuration</Label>
          </div>

          {showConfigAdvanced && (
            <div className="pt-2 space-y-4 border-t">
              <div className="space-y-2">
                <Label>Score Range</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-12">Min:</span>
                  <Slider 
                    min={0} 
                    max={100} 
                    step={1}
                    value={[config.minScore]}
                    onValueChange={(values) => setConfig({...config, minScore: values[0]})}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    className="w-16"
                    value={config.minScore}
                    onChange={(e) => setConfig({...config, minScore: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-12">Max:</span>
                  <Slider 
                    min={0} 
                    max={100} 
                    step={1}
                    value={[config.maxScore]}
                    onValueChange={(values) => setConfig({...config, maxScore: values[0]})}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    className="w-16"
                    value={config.maxScore}
                    onChange={(e) => setConfig({...config, maxScore: parseInt(e.target.value) || 100})}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button
          onClick={handleCleanupTestData}
          variant="outline"
          disabled={isCleaning || isGenerating}
          className="flex items-center gap-2 text-red-500 hover:text-red-600"
        >
          {isCleaning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          {isCleaning ? "Cleaning..." : "Remove All Test Data"}
        </Button>
        
        <Button
          onClick={handleGenerateTestData}
          disabled={isGenerating || isCleaning}
          className="flex items-center gap-2"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {isGenerating ? "Generating..." : "Generate Test Data"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestHarness;
