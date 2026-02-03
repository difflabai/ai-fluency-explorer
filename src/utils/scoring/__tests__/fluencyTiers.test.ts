import { describe, it, expect } from 'vitest';
import { determineUserTier } from '../tierUtils';

describe('determineUserTier', () => {
  it('returns Novice for score 0', () => {
    expect(determineUserTier(0).name).toBe('Novice');
  });

  it('returns Advanced Beginner for score 50', () => {
    expect(determineUserTier(50).name).toBe('Advanced Beginner');
  });

  it('returns Competent for score 100', () => {
    expect(determineUserTier(100).name).toBe('Competent');
  });

  it('returns Proficient for score 150', () => {
    expect(determineUserTier(150).name).toBe('Proficient');
  });

  it('returns Expert for score 200', () => {
    expect(determineUserTier(200).name).toBe('Expert');
  });

  it('defaults to Novice for out-of-range score', () => {
    expect(determineUserTier(999).name).toBe('Novice');
  });
});
