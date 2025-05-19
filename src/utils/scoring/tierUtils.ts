
import { FluencyTier } from './types';
import { fluencyTiers } from './fluencyTiers';

/**
 * Determine user tier based on score
 */
export const determineUserTier = (score: number): FluencyTier => {
  for (const tier of fluencyTiers) {
    if (score >= tier.range[0] && score <= tier.range[1]) {
      return tier;
    }
  }
  return fluencyTiers[0]; // Default to novice if something goes wrong
};

/**
 * Determines tier based on percentage score
 */
export const calculateTierForScore = (percentageScore: number): FluencyTier => {
  // Convert percentage to absolute score range
  const score = (percentageScore / 100) * 240;
  
  return determineUserTier(score);
};
