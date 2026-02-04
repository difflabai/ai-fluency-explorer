import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Brain,
  Timer,
  BarChart2,
  Trophy,
  Compass,
  CheckCircle,
  ArrowRight,
  FileCheck,
  Award,
  ListCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LeaderboardPreview from './LeaderboardPreview';
import SampleResultsCarousel from './SampleResultsCarousel';

interface LandingPageProps {
  onStartQuickTest: () => void;
  onStartComprehensiveTest: () => void;
  onStartQuickStart: () => void;
  onGetYourTier: () => void;
  onChartYourPath: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onStartQuickTest,
  onStartComprehensiveTest,
  onStartQuickStart,
  onGetYourTier,
  onChartYourPath,
}) => {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      {/* Hero section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-purple-100 mb-6">
          <Brain className="h-10 w-10 text-blue-500" />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-blue-500">AI Fluency Test</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Measure your AI literacy, discover your strengths, and build a personalized
          learning path to enhance your skills.
        </p>

        {/* Leaderboard button */}
        <div className="mt-6">
          <Link to="/leaderboard">
            <Button variant="outline" className="flex items-center gap-2 bg-white">
              <Award className="h-4 w-4 text-purple-500" />
              <span>View Full Leaderboard</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content grid with test options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Quick Start - Curated 10-question intro assessment */}
        <Card className="card-hover-effect rounded-xl overflow-hidden shadow-sm border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <ListCheck className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold">Quick Start</h2>
              <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">
                ~2 min
              </span>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Get a quick snapshot of your AI fluency with 10 curated questions.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">10 curated questions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">All 4 skill categories</span>
              </li>
            </ul>
            <Button
              onClick={onStartQuickStart}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              Quick Start <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

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
              A 50-question assessment to get a quick snapshot of your AI literacy in
              under 20 minutes.
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
              The full 240-question assessment for detailed insights into all aspects of
              your AI fluency.
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

      {/* Leaderboard section - moved below assessment boxes */}
      <div className="mb-16">
        <LeaderboardPreview />
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
              Take our comprehensive test to measure your AI literacy across key skill
              categories.
            </p>
          </div>

          <div className="text-center cursor-pointer" onClick={onGetYourTier}>
            <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Get Your Tier</h3>
            <p className="text-gray-600 text-sm">
              Discover your AI fluency level from Novice to Expert with detailed
              insights.
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

      {/* New test introduction and results example section */}
      <div className="bg-purple-50 rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Understanding Your Test Results
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column - Test introduction */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-purple-600" />
              About the Assessment
            </h3>
            <p className="text-gray-700 mb-4">
              Our AI Fluency Test evaluates your understanding across multiple
              dimensions of AI literacy, including conceptual knowledge, practical
              application skills, and awareness of emerging trends.
            </p>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <span className="font-medium">Personalized Assessment:</span>{' '}
                  Questions adapt based on your knowledge level
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <span className="font-medium">Comprehensive Analysis:</span> Detailed
                  breakdown of strengths and areas for improvement
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <span className="font-medium">Tier Classification:</span> Discover
                  where you fall on the AI fluency spectrum
                </span>
              </li>
            </ul>
          </div>

          {/* Right column - Sample Results Carousel */}
          <div>
            <SampleResultsCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
