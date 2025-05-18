
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Timer, 
  BarChart2, 
  Trophy, 
  Share2, 
  Compass, 
  CheckCircle,
  CheckSquare
} from 'lucide-react';

interface LandingPageProps {
  onStartQuickTest: () => void;
  onStartComprehensiveTest: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartQuickTest, onStartComprehensiveTest }) => {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      {/* Hero section */}
      <div className="text-center mb-12">
        <div className="inline-block p-3 rounded-full bg-ai-purple-light mb-4">
          <Brain className="h-8 w-8 text-ai-purple" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-ai-purple to-ai-blue-dark text-transparent bg-clip-text">
          AI Fluency Test
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Measure your AI literacy, discover your strengths, and build a personalized learning path to enhance your skills.
        </p>
      </div>
      
      {/* Test options */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <Card className="card-hover-effect border-2 border-ai-purple-light">
          <CardContent className="p-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="p-2 rounded-md bg-ai-purple-light">
                <Timer className="h-6 w-6 text-ai-purple" />
              </div>
              <h2 className="text-2xl font-bold">Quick Assessment</h2>
            </div>
            <p className="text-gray-600 mb-4">
              A 15-question assessment to get a quick snapshot of your AI literacy in under 10 minutes.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-ai-purple mr-2 flex-shrink-0" />
                <span>15 true/false questions</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-ai-purple mr-2 flex-shrink-0" />
                <span>Takes ~5-10 minutes</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-ai-purple mr-2 flex-shrink-0" />
                <span>Basic results and tier</span>
              </li>
            </ul>
            <Button onClick={onStartQuickTest} className="w-full bg-ai-purple hover:bg-ai-purple-dark">
              Start Quick Test
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover-effect">
          <CardContent className="p-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="p-2 rounded-md bg-blue-100">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold">Comprehensive Test</h2>
            </div>
            <p className="text-gray-600 mb-4">
              The full 240-question assessment for detailed insights into all aspects of your AI fluency.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <CheckSquare className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <span>Full 240-question assessment (simulated with 15 questions)</span>
              </li>
              <li className="flex items-center">
                <CheckSquare className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <span>Takes ~2 hours (simulated as 15-20 minutes)</span>
              </li>
              <li className="flex items-center">
                <CheckSquare className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <span>Detailed analysis and personalized recommendations</span>
              </li>
            </ul>
            <Button onClick={onStartComprehensiveTest} variant="outline" className="w-full">
              Start Full Test
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Features section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-ai-purple-light mb-4">
              <BarChart2 className="h-8 w-8 text-ai-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Assess Your Skills</h3>
            <p className="text-gray-600">
              Take our comprehensive test to measure your AI literacy across six key skill categories.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Your Tier</h3>
            <p className="text-gray-600">
              Discover your AI fluency level from Novice to Expert with detailed insights.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <Compass className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chart Your Path</h3>
            <p className="text-gray-600">
              Receive a personalized learning roadmap to enhance your AI skills.
            </p>
          </div>
        </div>
      </div>
      
      {/* Testimonial/CTA section */}
      <div className="bg-gradient-to-r from-ai-purple-light to-ai-blue-light rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Measure Your AI Fluency?</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Join thousands of professionals who have used our assessment to identify their AI strengths and growth areas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onStartQuickTest} 
            size="lg" 
            className="bg-ai-purple hover:bg-ai-purple-dark"
          >
            Take the Quick Test
          </Button>
          <Button 
            onClick={onStartComprehensiveTest} 
            variant="outline" 
            size="lg" 
            className="bg-white hover:bg-gray-50"
          >
            Start Full Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
