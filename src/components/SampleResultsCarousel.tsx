
import React from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, ListCheck } from 'lucide-react';

interface SampleResultProps {
  overallScore: number;
  maxScore: number;
  tierName: string;
  tierDescription: string;
  categories: Array<{name: string, percentage: number}>;
}

const sampleResults: SampleResultProps[] = [
  {
    overallScore: 145,
    maxScore: 240,
    tierName: "Proficient",
    tierDescription: "Advanced understanding with specialized knowledge in multiple areas",
    categories: [
      { name: "Prompt Engineering", percentage: 85 },
      { name: "AI Ethics", percentage: 70 },
      { name: "Technical Concepts", percentage: 55 },
      { name: "Practical Applications", percentage: 65 }
    ]
  },
  {
    overallScore: 187,
    maxScore: 240,
    tierName: "Expert",
    tierDescription: "Comprehensive mastery of AI concepts, applications, and emerging trends",
    categories: [
      { name: "Prompt Engineering", percentage: 92 },
      { name: "AI Ethics", percentage: 88 },
      { name: "Technical Concepts", percentage: 75 },
      { name: "Practical Applications", percentage: 82 }
    ]
  },
  {
    overallScore: 98,
    maxScore: 240,
    tierName: "Competent",
    tierDescription: "Solid grasp of AI fundamentals with practical application skills",
    categories: [
      { name: "Prompt Engineering", percentage: 65 },
      { name: "AI Ethics", percentage: 45 },
      { name: "Technical Concepts", percentage: 35 },
      { name: "Practical Applications", percentage: 52 }
    ]
  }
];

const SampleResultCard: React.FC<{ result: SampleResultProps }> = ({ result }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm w-full">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        Sample Results Overview
      </h3>
      
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm font-medium">Overall Score</span>
          <span className="text-sm text-gray-500">{result.overallScore}/{result.maxScore}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 rounded-full" 
            style={{ width: `${(result.overallScore / result.maxScore) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Your AI Fluency Tier</h4>
        <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
          {result.tierName}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {result.tierDescription}
        </p>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Category Breakdown</h4>
        <div className="space-y-2">
          {result.categories.map((category, index) => (
            <div key={index} className="flex justify-between text-xs">
              <span>{category.name}</span>
              <span className="text-gray-500">{category.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-sm flex items-center justify-center gap-1 text-purple-600">
          <ListCheck className="h-4 w-4" />
          <span>Complete your assessment to view detailed results</span>
        </div>
      </div>
    </div>
  );
};

const SampleResultsCarousel: React.FC = () => {
  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {sampleResults.map((result, index) => (
            <CarouselItem key={index} className="md:basis-1/1">
              <SampleResultCard result={result} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center mt-4">
          <CarouselPrevious className="relative static mx-2 translate-y-0" />
          <CarouselNext className="relative static mx-2 translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default SampleResultsCarousel;
