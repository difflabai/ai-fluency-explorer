
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  TestTube, 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight,
  Clock,
  Database,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { runSystemTests, generateTestReport, SystemTestSuite, SystemTestResult } from '@/utils/systemTest';

const SystemTestPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testSuites, setTestSuites] = useState<SystemTestSuite[]>([]);
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set());
  const [lastRunTime, setLastRunTime] = useState<Date | null>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    setTestSuites([]);
    
    try {
      console.log('🧪 Starting comprehensive system tests...');
      
      const results = await runSystemTests();
      setTestSuites(results);
      setLastRunTime(new Date());
      
      const report = generateTestReport(results);
      console.log(report);
      
      const totalTests = results.reduce((sum, suite) => sum + suite.results.length, 0);
      const passedTests = results.reduce((sum, suite) => 
        sum + suite.results.filter(r => r.status === 'PASS').length, 0);
      const failedTests = results.reduce((sum, suite) => 
        sum + suite.results.filter(r => r.status === 'FAIL').length, 0);
      
      if (failedTests === 0) {
        toast({
          title: "System Tests Completed",
          description: `All ${totalTests} tests passed successfully! 🎉`,
        });
      } else {
        toast({
          title: "System Tests Completed with Issues",
          description: `${passedTests}/${totalTests} tests passed. Check results for details.`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('System tests failed:', error);
      toast({
        title: "System Tests Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const toggleSuiteExpansion = (suiteName: string) => {
    const newExpanded = new Set(expandedSuites);
    if (newExpanded.has(suiteName)) {
      newExpanded.delete(suiteName);
    } else {
      newExpanded.add(suiteName);
    }
    setExpandedSuites(newExpanded);
  };

  const getStatusIcon = (status: 'PASS' | 'FAIL' | 'WARNING') => {
    switch (status) {
      case 'PASS': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAIL': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'WARNING': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: 'PASS' | 'FAIL' | 'WARNING') => {
    const variant = status === 'PASS' ? 'default' : status === 'FAIL' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
  };

  const overallStatus = testSuites.length > 0 ? (
    testSuites.some(s => s.overallStatus === 'FAIL') ? 'FAIL' :
    testSuites.some(s => s.overallStatus === 'WARNING') ? 'WARNING' : 'PASS'
  ) : null;

  const totalTests = testSuites.reduce((sum, suite) => sum + suite.results.length, 0);
  const passedTests = testSuites.reduce((sum, suite) => 
    sum + suite.results.filter(r => r.status === 'PASS').length, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          System Test Suite
        </CardTitle>
        <CardDescription>
          Comprehensive testing of all system components including database integrity, 
          scoring accuracy, and synthetic data generation.
        </CardDescription>
        
        {lastRunTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last run: {lastRunTime.toLocaleString()}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Test Summary */}
        {testSuites.length > 0 && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalTests}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                {overallStatus && getStatusIcon(overallStatus)}
                {overallStatus && getStatusBadge(overallStatus)}
              </div>
              <div className="text-sm text-muted-foreground">Overall Status</div>
            </div>
          </div>
        )}

        {/* Run Tests Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleRunTests} 
            disabled={isRunning}
            size="lg"
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run System Tests
              </>
            )}
          </Button>
        </div>

        {/* Test Results */}
        {testSuites.length > 0 && (
          <div className="space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-5 w-5" />
              Test Results
            </h3>

            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-3">
                {testSuites.map((suite) => (
                  <Collapsible
                    key={suite.suiteName}
                    open={expandedSuites.has(suite.suiteName)}
                    onOpenChange={() => toggleSuiteExpansion(suite.suiteName)}
                  >
                    <CollapsibleTrigger asChild>
                      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {expandedSuites.has(suite.suiteName) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <div>
                                <div className="font-semibold">{suite.suiteName}</div>
                                <div className="text-sm text-muted-foreground">{suite.summary}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(suite.overallStatus)}
                              {getStatusBadge(suite.overallStatus)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-2 ml-4">
                      <div className="space-y-2">
                        {suite.results.map((result, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-md">
                            {getStatusIcon(result.status)}
                            <div className="flex-1">
                              <div className="font-medium">{result.testName}</div>
                              <div className="text-sm text-muted-foreground">{result.message}</div>
                              {result.details && (
                                <details className="mt-2">
                                  <summary className="text-xs cursor-pointer text-blue-600 hover:text-blue-800">
                                    Show Details
                                  </summary>
                                  <pre className="mt-1 text-xs bg-background p-2 rounded border overflow-x-auto">
                                    {JSON.stringify(result.details, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemTestPanel;
