import React, { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import TestInterface from '@/components/TestInterface';
import { fluencyTiers, FluencyTier } from '@/utils/scoring';
import { toast } from '@/hooks/use-toast';

type ViewMode =
  | 'landing'
  | 'quick'
  | 'comprehensive'
  | 'quickstart'
  | 'tier-info'
  | 'learning-path';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');

  const startQuickTest = () => {
    setViewMode('quick');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startComprehensiveTest = () => {
    setViewMode('comprehensive');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startQuickStart = () => {
    setViewMode('quickstart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showGetYourTier = () => {
    setViewMode('tier-info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({
      title: 'AI Fluency Tiers',
      description: 'Explore the different fluency levels from Novice to Expert.',
    });
  };

  const showChartYourPath = () => {
    setViewMode('learning-path');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({
      title: 'Learning Path',
      description:
        'Discover how to enhance your AI skills with a personalized roadmap.',
    });
  };

  const returnToHome = () => {
    setViewMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render content based on viewMode
  const renderContent = () => {
    switch (viewMode) {
      case 'landing':
        return (
          <LandingPage
            onStartQuickTest={startQuickTest}
            onStartComprehensiveTest={startComprehensiveTest}
            onStartQuickStart={startQuickStart}
            onGetYourTier={showGetYourTier}
            onChartYourPath={showChartYourPath}
          />
        );
      case 'quick':
        return <TestInterface testType="quick" onReturnHome={returnToHome} />;
      case 'comprehensive':
        return <TestInterface testType="comprehensive" onReturnHome={returnToHome} />;
      case 'quickstart':
        return <TestInterface testType="quickstart" onReturnHome={returnToHome} />;
      case 'tier-info':
        return <TierInfoView tiers={fluencyTiers} onReturn={returnToHome} />;
      case 'learning-path':
        return <LearningPathView onReturn={returnToHome} />;
      default:
        return (
          <LandingPage
            onStartQuickTest={startQuickTest}
            onStartComprehensiveTest={startComprehensiveTest}
            onStartQuickStart={startQuickStart}
            onGetYourTier={showGetYourTier}
            onChartYourPath={showChartYourPath}
          />
        );
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderContent()}</div>;
};

// Component to display tier information
const TierInfoView = ({
  tiers,
  onReturn,
}: {
  tiers: FluencyTier[];
  onReturn: () => void;
}) => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-500">AI Fluency Tiers</h1>
        <Button
          onClick={onReturn}
          variant="outline"
          className="flex gap-2 items-center"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </div>

      <div className="space-y-6 mb-12">
        <p className="text-lg text-gray-700">
          Your AI fluency level indicates how effectively you can work with and leverage
          AI technologies. Our assessment helps identify which tier you fall into and
          provides guidance for improvement.
        </p>
      </div>

      <div className="space-y-6">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className="overflow-hidden border-l-4"
            style={{ borderLeftColor: tier.color.replace('bg-', '') }}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <p className="text-gray-600">{tier.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded-full">
                  <span>Score Range:</span>
                  <span className="font-semibold">
                    {tier.range[0]} - {tier.range[1]}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Component to display learning path information
const LearningPathView = ({ onReturn }: { onReturn: () => void }) => {
  const learningPaths = [
    {
      title: 'AI Fundamentals',
      description:
        'Start with the basics of AI, including terminology, key concepts, and history.',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-500',
    },
    {
      title: 'Prompt Engineering',
      description:
        'Learn how to craft effective prompts to get the most out of AI systems.',
      icon: Edit,
      color: 'bg-purple-100 text-purple-500',
    },
    {
      title: 'Domain Specialization',
      description:
        'Apply AI to your specific field or industry with specialized techniques.',
      icon: Briefcase,
      color: 'bg-green-100 text-green-500',
    },
    {
      title: 'Advanced Integration',
      description:
        'Build workflows and systems that combine multiple AI tools effectively.',
      icon: Layers,
      color: 'bg-amber-100 text-amber-500',
    },
    {
      title: 'Ethical AI Usage',
      description:
        'Understand the ethical implications and responsible use of AI technologies.',
      icon: Shield,
      color: 'bg-red-100 text-red-500',
    },
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-500">AI Learning Path</h1>
        <Button
          onClick={onReturn}
          variant="outline"
          className="flex gap-2 items-center"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </div>

      <div className="space-y-6 mb-12">
        <p className="text-lg text-gray-700">
          Based on your assessment results, we provide a personalized learning path to
          help you enhance your AI skills and move up to the next fluency tier. Start
          with the fundamentals and progress through more advanced topics.
        </p>
      </div>

      <div className="space-y-6">
        {learningPaths.map((path, index) => (
          <Card key={path.title} className="card-hover-effect">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg ${path.color} flex items-center justify-center`}
                >
                  <path.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="inline-block bg-gray-200 text-gray-700 rounded-full h-6 w-6 text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    {path.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{path.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button
          onClick={onReturn}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          Take an Assessment to Get Your Personalized Path
        </Button>
      </div>
    </div>
  );
};

// Import missing components and icons
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Edit, Briefcase, Layers, Shield } from 'lucide-react';

export default Index;
