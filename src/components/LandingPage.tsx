
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Timer, 
  BarChart2, 
  Trophy, 
  Compass, 
  CheckCircle,
  ArrowRight,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandingPageProps {
  onStartQuickTest: () => void;
  onStartComprehensiveTest: () => void;
  onGetYourTier: () => void;
  onChartYourPath: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartQuickTest, 
  onStartComprehensiveTest,
  onGetYourTier,
  onChartYourPath
}) => {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      {/* Hero section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-purple-100 mb-6">
          <Brain className="h-10 w-10 text-blue-500" />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-blue-500">
          AI Fluency Test
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Measure your AI literacy, discover your strengths, and build a personalized learning path to enhance your skills.
        </p>

        {/* Leaderboard button */}
        <div className="mt-6">
          <Link to="/leaderboard">
            <Button variant="outline" className="flex items-center gap-2 bg-white">
              <Users className="h-4 w-4 text-purple-500" />
              <span>View Leaderboard</span>
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Test options */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {/* Quick Assessment */}
        <Card className="card-hover-effect rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-100">
                <Timer className="h-7 w-7 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold">Quick Assessment</h2>
            </div>
            <p className="text-gray-600 mb-6">
              A 50-question assessment to get a quick snapshot of your AI literacy in under 20 minutes.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                <span className="text-gray-700">50 true/false questions</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                <span className="text-gray-700">Takes ~15-20 minutes</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                <span className="text-gray-700">Basic results and tier</span>
              </li>
            </ul>
            <Button 
              onClick={onStartQuickTest} 
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              Start Quick Test <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Comprehensive Test */}
        <Card className="card-hover-effect rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Brain className="h-7 w-7 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold">Comprehensive Test</h2>
            </div>
            <p className="text-gray-600 mb-6">
              The full 240-question assessment for detailed insights into all aspects of your AI fluency.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700">Full 240-question assessment</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700">Takes ~2 hours to complete</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700">Detailed analysis and recommendations</span>
              </li>
            </ul>
            <Button 
              onClick={onStartComprehensiveTest} 
              variant="outline"
              className="w-full border-2 text-blue-500 border-blue-500 hover:bg-blue-50"
            >
              Start Full Test <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* How It Works section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="mx-auto inline-flex items-center justify-center h-20 w-20 rounded-full bg-purple-100 mb-6">
              <BarChart2 className="h-10 w-10 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Assess Your Skills</h3>
            <p className="text-gray-600">
              Take our comprehensive test to measure your AI literacy across six key skill categories.
            </p>
          </div>
          
          <div className="text-center cursor-pointer" onClick={onGetYourTier}>
            <div className="mx-auto inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-6">
              <Trophy className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Get Your Tier</h3>
            <p className="text-gray-600">
              Discover your AI fluency level from Novice to Expert with detailed insights.
            </p>
          </div>
          
          <div className="text-center cursor-pointer" onClick={onChartYourPath}>
            <div className="mx-auto inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <Compass className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Chart Your Path</h3>
            <p className="text-gray-600">
              Receive a personalized learning roadmap to enhance your AI skills.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-purple-50 rounded-2xl p-10 text-center shadow-sm">
        <h2 className="text-3xl font-bold mb-4">Ready to Measure Your AI Fluency?</h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg">
          Join thousands of professionals who have used our assessment to identify their AI strengths and growth areas.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button 
            onClick={onStartQuickTest} 
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2"
          >
            Take the Quick Test
          </Button>
          <Button 
            onClick={onStartComprehensiveTest} 
            variant="outline" 
            className="bg-white hover:bg-gray-50 text-blue-500 border-blue-500 px-8 py-2"
          >
            Start Full Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
