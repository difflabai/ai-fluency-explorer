
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
import LeaderboardPreview from './LeaderboardPreview';

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
      
      {/* Main content grid with test options and leaderboard */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="md:col-span-2">
          {/* Test options in a grid */}
          <div className="grid md:grid-cols-2 gap-6 h-full">
            {/* Quick Assessment */}
            <Card className="card-hover-effect rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Timer className="h-6 w-6 text-purple-500" />
                  </div>
                  <h2 className="text-xl font-bold">Quick Assessment</h2>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  A 50-question assessment to get a quick snapshot of your AI literacy in under 20 minutes.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-700">50 true/false questions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-700">Takes ~15-20 minutes</span>
                  </li>
                </ul>
                <Button 
                  onClick={onStartQuickTest} 
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                  size="sm"
                >
                  Start Quick Test <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            {/* Comprehensive Test */}
            <Card className="card-hover-effect rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Brain className="h-6 w-6 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold">Comprehensive</h2>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  The full 240-question assessment for detailed insights into all aspects of your AI fluency.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">240 questions assessment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">Takes ~2 hours to complete</span>
                  </li>
                </ul>
                <Button 
                  onClick={onStartComprehensiveTest} 
                  variant="outline"
                  className="w-full border-2 text-blue-500 border-blue-500 hover:bg-blue-50"
                  size="sm"
                >
                  Start Full Test <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Leaderboard column */}
        <div>
          <LeaderboardPreview />
        </div>
      </div>
      
      {/* How It Works section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
              <BarChart2 className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Assess Your Skills</h3>
            <p className="text-gray-600 text-sm">
              Take our comprehensive test to measure your AI literacy across key skill categories.
            </p>
          </div>
          
          <div className="text-center cursor-pointer" onClick={onGetYourTier}>
            <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Get Your Tier</h3>
            <p className="text-gray-600 text-sm">
              Discover your AI fluency level from Novice to Expert with detailed insights.
            </p>
          </div>
          
          <div className="text-center cursor-pointer" onClick={onChartYourPath}>
            <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <Compass className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Chart Your Path</h3>
            <p className="text-gray-600 text-sm">
              Receive a personalized learning roadmap to enhance your AI skills.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-purple-50 rounded-2xl p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold mb-3">Ready to Measure Your AI Fluency?</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Join thousands of professionals who have used our assessment to identify their AI strengths and growth areas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onStartQuickTest} 
            className="bg-purple-500 hover:bg-purple-600 text-white px-6"
          >
            Take the Quick Test
          </Button>
          <Button 
            onClick={onStartComprehensiveTest} 
            variant="outline" 
            className="bg-white hover:bg-gray-50 text-blue-500 border-blue-500 px-6"
          >
            Start Full Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
