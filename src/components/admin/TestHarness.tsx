
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateTestData, cleanupTestData } from '@/utils/testData';
import type { TestDataConfig } from '@/utils/testData';
import { TestDataForm, TestDataInfoAlert, TestDataActions } from './TestHarnessComponents';

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
        <TestDataInfoAlert />
        
        <TestDataForm 
          config={config}
          setConfig={setConfig}
          showConfigAdvanced={showConfigAdvanced}
          setShowConfigAdvanced={setShowConfigAdvanced}
        />
      </CardContent>

      <CardFooter>
        <TestDataActions 
          isGenerating={isGenerating}
          isCleaning={isCleaning}
          onGenerate={handleGenerateTestData}
          onCleanup={handleCleanupTestData}
        />
      </CardFooter>
    </Card>
  );
};

export default TestHarness;
