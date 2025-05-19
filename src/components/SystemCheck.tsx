import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { runSystemCheck } from '@/utils/systemCheck';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

type CheckResult = {
  success: boolean;
  message: string;
  details?: any;
};

const SystemCheck: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<{[key: string]: boolean}>({});
  const { isAdmin } = useAuth();
  
  // Redirect non-admin users to the home page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  const handleRunCheck = async () => {
    setIsLoading(true);
    try {
      const checkResults = await runSystemCheck();
      setResults(checkResults);
    } catch (error) {
      console.error("Error running system check:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleDetails = (index: number) => {
    setExpandedDetails(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const successCount = results?.filter(r => r.success).length || 0;
  const failCount = results?.filter(r => !r.success).length || 0;
  
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          System Diagnostic
        </CardTitle>
        <CardDescription>
          Verify application functionality and database setup
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!results ? (
          <div className="text-center py-8 text-muted-foreground">
            Run the system check to verify your application setup
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between px-4 py-2 bg-muted rounded-lg">
              <div className="font-medium">Summary</div>
              <div className="flex gap-4">
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> {successCount} passed
                </span>
                {failCount > 0 && (
                  <span className="text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {failCount} failed
                  </span>
                )}
              </div>
            </div>
            
            <div className="divide-y">
              {results.map((result, index) => (
                <div key={index} className="py-2">
                  <div 
                    className="flex justify-between items-center cursor-pointer py-2"
                    onClick={() => toggleDetails(index)}
                  >
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className={result.success ? "text-gray-800" : "text-red-600"}>
                        {result.message}
                      </span>
                    </div>
                    {result.details && (
                      <div>
                        {expandedDetails[index] ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {expandedDetails[index] && result.details && (
                    <div className="mt-2 pl-7 text-sm text-gray-600 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                      <pre className="font-mono text-xs overflow-auto">
                        {typeof result.details === 'object' 
                          ? JSON.stringify(result.details, null, 2)
                          : String(result.details)
                        }
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleRunCheck} 
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Running checks...' : 'Run System Check'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SystemCheck;
