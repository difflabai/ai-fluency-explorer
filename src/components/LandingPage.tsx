
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
  CheckSquare,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onStartQuickTest: () => void;
  onStartComprehensiveTest: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartQuickTest, onStartComprehensiveTest }) => {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      {/* Hero section */}
      <div className="text-center mb-16">
        <div className="inline-block p-4 rounded-full bg-ai-purple-light mb-6">
          <Brain className="h-10 w-10 text-ai-purple" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-ai-purple to-ai-blue-dark text-transparent bg-clip-text">
          AI Fluency Test
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Measure your AI literacy, discover your strengths, and build a personalized learning path to enhance your skills.
        </p>
      </div>
      
      {/* Test options */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <Card className="card-hover-effect border-2 border-ai-purple-light rounded-xl overflow-hidden shadow-lg">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="p-3 rounded-lg bg-ai-purple-light">
                <Timer className="h-7 w-7 text-ai-purple" />
              </div>
              <h2 className="text-2xl font-bold">Quick Assessment</h2>
            </div>
            <p className="text-gray-600 mb-6 text-lg">
              A 50-question assessment to get a quick snapshot of your AI literacy in under 20 minutes.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-ai-purple flex-shrink-0" />
                <span className="text-gray-700">50 true/false questions</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-ai-purple flex-shrink-0" />
                <span className="text-gray-700">Takes ~15-20 minutes</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-ai-purple flex-shrink-0" />
                <span className="text-gray-700">Basic results and tier</span>
              </li>
            </ul>
            <Button onClick={onStartQuickTest} className="w-full bg-ai-purple hover:bg-ai-purple-dark text-lg h-14">
              Start Quick Test <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover-effect rounded-xl overflow-hidden shadow-lg">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Brain className="h-7 w-7 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold">Comprehensive Test</h2>
            </div>
            <p className="text-gray-600 mb-6 text-lg">
              The full 240-question assessment for detailed insights into all aspects of your AI fluency.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckSquare className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Full 240-question assessment</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckSquare className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Takes ~2 hours to complete</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckSquare className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Detailed analysis and recommendations</span>
              </li>
            </ul>
            <Button onClick={onStartComprehensiveTest} variant="outline" className="w-full border-2 text-lg h-14">
              Start Full Test <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Features section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-ai-purple-light mb-6">
              <BarChart2 className="h-10 w-10 text-ai-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Assess Your Skills</h3>
            <p className="text-gray-600">
              Take our comprehensive test to measure your AI literacy across six key skill categories.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-6">
              <Trophy className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Get Your Tier</h3>
            <p className="text-gray-600">
              Discover your AI fluency level from Novice to Expert with detailed insights.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
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
      <div className="bg-gradient-to-r from-ai-purple-light to-ai-blue-light rounded-2xl p-10 text-center shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Measure Your AI Fluency?</h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg">
          Join thousands of professionals who have used our assessment to identify their AI strengths and growth areas.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button 
            onClick={onStartQuickTest} 
            size="lg" 
            className="bg-ai-purple hover:bg-ai-purple-dark text-lg px-8 py-6 h-auto"
          >
            Take the Quick Test
          </Button>
          <Button 
            onClick={onStartComprehensiveTest} 
            variant="outline" 
            size="lg" 
            className="bg-white hover:bg-gray-50 text-lg px-8 py-6 h-auto"
          >
            Start Full Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
