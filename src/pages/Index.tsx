
import React, { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import TestInterface from '@/components/TestInterface';

const Index = () => {
  const [testMode, setTestMode] = useState<'landing' | 'quick' | 'comprehensive'>('landing');
  
  const startQuickTest = () => {
    setTestMode('quick');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const startComprehensiveTest = () => {
    setTestMode('comprehensive');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const returnToHome = () => {
    setTestMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {testMode === 'landing' && (
        <LandingPage 
          onStartQuickTest={startQuickTest}
          onStartComprehensiveTest={startComprehensiveTest}
        />
      )}
      
      {testMode === 'quick' && (
        <TestInterface
          testType="quick"
          onReturnHome={returnToHome}
        />
      )}
      
      {testMode === 'comprehensive' && (
        <TestInterface
          testType="comprehensive"
          onReturnHome={returnToHome}
        />
      )}
    </div>
  );
};

export default Index;
