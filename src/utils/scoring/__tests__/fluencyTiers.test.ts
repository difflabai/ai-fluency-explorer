import { describe, it, expect } from 'vitest';
import { fluencyTiers } from '../fluencyTiers';

describe('fluencyTiers', () => {
  it('should have 5 fluency tiers', () => {
    expect(fluencyTiers).toHaveLength(5);
  });

  it('should have correct tier names in order', () => {
    const tierNames = fluencyTiers.map((t) => t.name);
    expect(tierNames).toEqual([
      'Novice',
      'Advanced Beginner',
      'Competent',
      'Proficient',
      'Expert',
    ]);
  });

  it('should have non-overlapping ranges', () => {
    for (let i = 0; i < fluencyTiers.length - 1; i++) {
      const currentTier = fluencyTiers[i];
      const nextTier = fluencyTiers[i + 1];
      expect(currentTier.range[1]).toBeLessThan(nextTier.range[0]);
    }
  });

  it('should start at 0 and end at 240', () => {
    expect(fluencyTiers[0].range[0]).toBe(0);
    expect(fluencyTiers[fluencyTiers.length - 1].range[1]).toBe(240);
  });

  it('should have valid color classes', () => {
    fluencyTiers.forEach((tier) => {
      expect(tier.color).toMatch(/^bg-/);
    });
  });

  it('should have descriptions for all tiers', () => {
    fluencyTiers.forEach((tier) => {
      expect(tier.description).toBeTruthy();
      expect(typeof tier.description).toBe('string');
    });
  });
});
