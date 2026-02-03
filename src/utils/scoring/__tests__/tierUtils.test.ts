import { describe, it, expect } from 'vitest';
import { determineUserTier, calculateTierForScore } from '../tierUtils';
import { fluencyTiers } from '../fluencyTiers';

describe('determineUserTier', () => {
  it('should return Novice for score 0', () => {
    const tier = determineUserTier(0);
    expect(tier.name).toBe('Novice');
  });

  it('should return Novice for score 36 (upper bound)', () => {
    const tier = determineUserTier(36);
    expect(tier.name).toBe('Novice');
  });

  it('should return Advanced Beginner for score 37', () => {
    const tier = determineUserTier(37);
    expect(tier.name).toBe('Advanced Beginner');
  });

  it('should return Advanced Beginner for score 72', () => {
    const tier = determineUserTier(72);
    expect(tier.name).toBe('Advanced Beginner');
  });

  it('should return Competent for score 73', () => {
    const tier = determineUserTier(73);
    expect(tier.name).toBe('Competent');
  });

  it('should return Competent for score 120', () => {
    const tier = determineUserTier(120);
    expect(tier.name).toBe('Competent');
  });

  it('should return Proficient for score 121', () => {
    const tier = determineUserTier(121);
    expect(tier.name).toBe('Proficient');
  });

  it('should return Proficient for score 168', () => {
    const tier = determineUserTier(168);
    expect(tier.name).toBe('Proficient');
  });

  it('should return Expert for score 169', () => {
    const tier = determineUserTier(169);
    expect(tier.name).toBe('Expert');
  });

  it('should return Expert for score 240 (max)', () => {
    const tier = determineUserTier(240);
    expect(tier.name).toBe('Expert');
  });

  it('should default to Novice for invalid negative scores', () => {
    const tier = determineUserTier(-1);
    expect(tier.name).toBe('Novice');
  });

  it('should default to Novice for scores above max', () => {
    const tier = determineUserTier(300);
    expect(tier.name).toBe('Novice');
  });
});

describe('calculateTierForScore', () => {
  it('should return Novice for 0%', () => {
    const tier = calculateTierForScore(0);
    expect(tier.name).toBe('Novice');
  });

  it('should return Novice for 15%', () => {
    // 15% of 240 = 36
    const tier = calculateTierForScore(15);
    expect(tier.name).toBe('Novice');
  });

  it('should return Advanced Beginner for ~16%', () => {
    // 16% of 240 = 38.4 (~37+)
    const tier = calculateTierForScore(16);
    expect(tier.name).toBe('Advanced Beginner');
  });

  it('should return Competent for ~31%', () => {
    // 31% of 240 = 74.4 (~73+)
    const tier = calculateTierForScore(31);
    expect(tier.name).toBe('Competent');
  });

  it('should return Proficient for ~51%', () => {
    // 51% of 240 = 122.4 (~121+)
    const tier = calculateTierForScore(51);
    expect(tier.name).toBe('Proficient');
  });

  it('should return Expert for ~71%', () => {
    // 71% of 240 = 170.4 (~169+)
    const tier = calculateTierForScore(71);
    expect(tier.name).toBe('Expert');
  });

  it('should return Expert for 100%', () => {
    const tier = calculateTierForScore(100);
    expect(tier.name).toBe('Expert');
  });
});
