
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Loader2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

interface QueryResult {
  categories: any[];
  questions: any[];
  testTypes: any[];
  mappings: any[];
}

const DatabaseQueryPanel: React.FC = () => {
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null);

  const queryDatabase = async () => {
    setIsQuerying(true);
    console.log("🔍 Starting direct database query...");
    
    try {
      // Query categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (categoriesError) {
        console.error("❌ Error querying categories:", categoriesError);
        throw categoriesError;
      }

      // Query questions with explanations
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select(`
          id,
          text,
          category_id,
          difficulty,
          correct_answer,
          explanation,
          is_active,
          version,
          created_at,
          updated_at
        `)
        .eq('is_active', true)
        .order('category_id, difficulty, text')
        .limit(50); // Limit to first 50 for performance
      
      if (questionsError) {
        console.error("❌ Error querying questions:", questionsError);
        throw questionsError;
      }

      // Query test types
      const { data: testTypes, error: testTypesError } = await supabase
        .from('test_types')
        .select('*')
        .order('name');
      
      if (testTypesError) {
        console.error("❌ Error querying test types:", testTypesError);
        throw testTypesError;
      }

      // Query test question mappings
      const { data: mappings, error: mappingsError } = await supabase
        .from('test_questions_map')
        .select(`
          id,
          test_type_id,
          question_id,
          created_at
        `)
        .order('test_type_id, created_at');
      
      if (mappingsError) {
        console.error("❌ Error querying mappings:", mappingsError);
        throw mappingsError;
      }

      const results: QueryResult = {
        categories: categories || [],
        questions: questions || [],
        testTypes: testTypes || [],
        mappings: mappings || []
      };

      setQueryResults(results);

      // Log detailed results
      console.log("✅ Database Query Results:");
      console.log(`📁 Categories: ${results.categories.length}`);
      console.log(`❓ Questions: ${results.questions.length}`);
      console.log(`🧪 Test Types: ${results.testTypes.length}`);
      console.log(`🔗 Question Mappings: ${results.mappings.length}`);

      // Check explanation status
      const questionsWithExplanations = results.questions.filter(q => q.explanation && q.explanation.trim().length > 0);
      const questionsWithoutExplanations = results.questions.filter(q => !q.explanation || q.explanation.trim().length === 0);
      
      console.log(`✅ Questions with explanations: ${questionsWithExplanations.length}`);
      console.log(`❌ Questions without explanations: ${questionsWithoutExplanations.length}`);

      // Show sample explanations
      if (questionsWithExplanations.length > 0) {
        console.log("📝 Sample explanations:");
        questionsWithExplanations.slice(0, 3).forEach((q, index) => {
          console.log(`${index + 1}. "${q.text.substring(0, 50)}..." - "${q.explanation.substring(0, 100)}..."`);
        });
      }

      toast({
        title: "Database Query Complete",
        description: `Found ${results.questions.length} questions, ${questionsWithExplanations.length} with explanations.`
      });

    } catch (error: any) {
      console.error("💥 Database query failed:", error);
      toast({
        title: "Query Failed",
        description: error.message || "Failed to query database. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsQuerying(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = queryResults?.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Query Results
        </CardTitle>
        <CardDescription>
          Direct database queries to verify migration status
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button 
          onClick={queryDatabase}
          disabled={isQuerying}
          className="w-full gap-2"
        >
          {isQuerying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          {isQuerying ? 'Querying Database...' : 'Query Database Tables'}
        </Button>

        {queryResults && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-2xl font-bold text-blue-600">{queryResults.categories.length}</div>
                <div className="text-sm text-blue-800">Categories</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-2xl font-bold text-green-600">{queryResults.questions.length}</div>
                <div className="text-sm text-green-800">Questions</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="text-2xl font-bold text-purple-600">{queryResults.testTypes.length}</div>
                <div className="text-sm text-purple-800">Test Types</div>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <div className="text-2xl font-bold text-orange-600">{queryResults.mappings.length}</div>
                <div className="text-sm text-orange-800">Mappings</div>
              </div>
            </div>

            {/* Explanation Status */}
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Question Explanations Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {queryResults.questions.filter(q => q.explanation && q.explanation.trim().length > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">With Explanations</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {queryResults.questions.filter(q => !q.explanation || q.explanation.trim().length === 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Without Explanations</div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-2">Categories ({queryResults.categories.length})</h3>
              <div className="bg-white border rounded p-3 max-h-32 overflow-y-auto">
                {queryResults.categories.map((category, index) => (
                  <div key={category.id} className="text-sm py-1">
                    {index + 1}. {category.name} - {category.description}
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Questions */}
            <div>
              <h3 className="font-semibold mb-2">Sample Questions with Explanations (First 10)</h3>
              <div className="bg-white border rounded p-3 max-h-96 overflow-y-auto space-y-3">
                {queryResults.questions
                  .filter(q => q.explanation && q.explanation.trim().length > 0)
                  .slice(0, 10)
                  .map((question, index) => (
                    <div key={question.id} className="border-b pb-2 last:border-b-0">
                      <div className="text-sm font-medium">
                        {index + 1}. {question.text.substring(0, 100)}...
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Category: {getCategoryName(question.category_id)} | 
                        Difficulty: {question.difficulty} | 
                        Answer: {question.correct_answer ? 'True' : 'False'}
                      </div>
                      <div className="text-xs text-green-700 mt-1 bg-green-50 p-2 rounded">
                        <strong>Explanation:</strong> {question.explanation.substring(0, 200)}...
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Updated: {formatDate(question.updated_at)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Test Types */}
            <div>
              <h3 className="font-semibold mb-2">Test Types</h3>
              <div className="bg-white border rounded p-3">
                {queryResults.testTypes.map((testType, index) => {
                  const mappingCount = queryResults.mappings.filter(m => m.test_type_id === testType.id).length;
                  return (
                    <div key={testType.id} className="text-sm py-1">
                      {index + 1}. {testType.name} - {mappingCount} questions mapped
                      {testType.question_limit && ` (limit: ${testType.question_limit})`}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseQueryPanel;
