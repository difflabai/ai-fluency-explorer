
import { FluencyTier } from './types';

export const fluencyTiers: FluencyTier[] = [
  {
    name: 'Novice',
    range: [0, 36],
    description: 'Just starting your AI journey with basic awareness of concepts.',
    color: 'bg-gray-300'
  },
  {
    name: 'Advanced Beginner',
    range: [37, 72],
    description: 'Growing understanding of core AI concepts and applications.',
    color: 'bg-blue-300'
  },
  {
    name: 'Competent',
    range: [73, 120],
    description: 'Solid grasp of AI fundamentals with practical application skills.',
    color: 'bg-green-400'
  },
  {
    name: 'Proficient',
    range: [121, 168],
    description: 'Advanced understanding with specialized knowledge in multiple areas.',
    color: 'bg-ai-purple'
  },
  {
    name: 'Expert',
    range: [169, 240],
    description: 'Comprehensive mastery of AI concepts, applications, and emerging trends.',
    color: 'bg-purple-600'
  }
];
