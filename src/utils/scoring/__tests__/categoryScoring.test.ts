import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateCategoryScores,
  calculateFluencyLevelScores,
} from '../categoryScoring';
import { Question, UserAnswer } from '../../testData';

// Suppress console logs in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('calculateCategoryScores', () => {
  const createQuestion = (
    id: number,
    category: string,
    difficulty: Question['difficulty']
  ): Question => ({
    id,
    text: `Question ${id}`,
    correctAnswer: true,
    category,
    difficulty,
  });

  const createUserAnswer = (questionId: number, answer: boolean): UserAnswer => ({
    questionId,
    answer,
  });

  it('should return category scores for skill categories', () => {
    const questions: Question[] = [
      createQuestion(1, '1', 'novice'), // Prompt Engineering
      createQuestion(2, '2', 'novice'), // AI Ethics
      createQuestion(3, '3', 'novice'), // Technical Concepts
      createQuestion(4, '4', 'novice'), // Practical Applications
    ];

    const userAnswers: UserAnswer[] = [
      createUserAnswer(1, true),
      createUserAnswer(2, true),
      createUserAnswer(3, false),
      createUserAnswer(4, true),
    ];

    const scores = calculateCategoryScores(questions, userAnswers);

    // Should have skill categories + fluency level categories
    expect(scores.length).toBeGreaterThanOrEqual(4);

    // Find skill category scores
    const promptEngineering = scores.find(
      (s) => s.categoryName === 'Prompt Engineering'
    );
    const aiEthics = scores.find((s) => s.categoryName === 'AI Ethics');
    const technicalConcepts = scores.find(
      (s) => s.categoryName === 'Technical Concepts'
    );
    const practicalApps = scores.find(
      (s) => s.categoryName === 'Practical Applications'
    );

    expect(promptEngineering?.score).toBe(1);
    expect(promptEngineering?.percentage).toBe(100);
    expect(aiEthics?.score).toBe(1);
    expect(aiEthics?.percentage).toBe(100);
    expect(technicalConcepts?.score).toBe(0);
    expect(technicalConcepts?.percentage).toBe(0);
    expect(practicalApps?.score).toBe(1);
    expect(practicalApps?.percentage).toBe(100);
  });

  it('should handle empty questions array', () => {
    const questions: Question[] = [];
    const userAnswers: UserAnswer[] = [];

    const scores = calculateCategoryScores(questions, userAnswers);

    // Should still return category structures with 0 scores
    expect(scores.length).toBeGreaterThan(0);
    scores.forEach((score) => {
      expect(score.score).toBe(0);
      expect(score.totalQuestions).toBe(0);
      expect(score.percentage).toBe(0);
    });
  });

  it('should include fluency level scores', () => {
    const questions: Question[] = [
      createQuestion(1, '1', 'novice'),
      createQuestion(2, '1', 'advanced-beginner'),
      createQuestion(3, '1', 'competent'),
      createQuestion(4, '1', 'proficient'),
      createQuestion(5, '1', 'expert'),
    ];

    const userAnswers: UserAnswer[] = [
      createUserAnswer(1, true),
      createUserAnswer(2, true),
      createUserAnswer(3, true),
      createUserAnswer(4, false),
      createUserAnswer(5, false),
    ];

    const scores = calculateCategoryScores(questions, userAnswers);

    // Check fluency level scores exist
    const noviceScore = scores.find((s) => s.categoryName === 'Novice');
    const advancedBeginnerScore = scores.find(
      (s) => s.categoryName === 'Advanced Beginner'
    );
    const competentScore = scores.find((s) => s.categoryName === 'Competent');
    const proficientScore = scores.find((s) => s.categoryName === 'Proficient');
    const expertScore = scores.find((s) => s.categoryName === 'Expert');

    expect(noviceScore).toBeDefined();
    expect(advancedBeginnerScore).toBeDefined();
    expect(competentScore).toBeDefined();
    expect(proficientScore).toBeDefined();
    expect(expertScore).toBeDefined();
  });
});

describe('calculateFluencyLevelScores', () => {
  const createQuestion = (
    id: number,
    difficulty: Question['difficulty']
  ): Question => ({
    id,
    text: `Question ${id}`,
    correctAnswer: true,
    category: '1',
    difficulty,
  });

  const createUserAnswer = (questionId: number, answer: boolean): UserAnswer => ({
    questionId,
    answer,
  });

  it('should calculate scores for each difficulty level', () => {
    const questions: Question[] = [
      createQuestion(1, 'novice'),
      createQuestion(2, 'novice'),
      createQuestion(3, 'advanced-beginner'),
      createQuestion(4, 'competent'),
      createQuestion(5, 'proficient'),
      createQuestion(6, 'expert'),
    ];

    const userAnswers: UserAnswer[] = [
      createUserAnswer(1, true),
      createUserAnswer(2, true),
      createUserAnswer(3, true),
      createUserAnswer(4, false),
      createUserAnswer(5, false),
      createUserAnswer(6, true),
    ];

    const scores = calculateFluencyLevelScores(questions, userAnswers);

    expect(scores).toHaveLength(5);

    const novice = scores.find((s) => s.categoryId === 'novice');
    expect(novice?.score).toBe(2);
    expect(novice?.totalQuestions).toBe(2);
    expect(novice?.percentage).toBe(100);

    const advancedBeginner = scores.find((s) => s.categoryId === 'advanced-beginner');
    expect(advancedBeginner?.score).toBe(1);
    expect(advancedBeginner?.totalQuestions).toBe(1);
    expect(advancedBeginner?.percentage).toBe(100);

    const competent = scores.find((s) => s.categoryId === 'competent');
    expect(competent?.score).toBe(0);
    expect(competent?.totalQuestions).toBe(1);
    expect(competent?.percentage).toBe(0);

    const proficient = scores.find((s) => s.categoryId === 'proficient');
    expect(proficient?.score).toBe(0);
    expect(proficient?.totalQuestions).toBe(1);
    expect(proficient?.percentage).toBe(0);

    const expert = scores.find((s) => s.categoryId === 'expert');
    expect(expert?.score).toBe(1);
    expect(expert?.totalQuestions).toBe(1);
    expect(expert?.percentage).toBe(100);
  });

  it('should return correct display names', () => {
    const questions: Question[] = [
      createQuestion(1, 'novice'),
      createQuestion(2, 'advanced-beginner'),
      createQuestion(3, 'competent'),
      createQuestion(4, 'proficient'),
      createQuestion(5, 'expert'),
    ];

    const userAnswers: UserAnswer[] = questions.map((q) =>
      createUserAnswer(q.id, true)
    );

    const scores = calculateFluencyLevelScores(questions, userAnswers);

    const displayNames = scores.map((s) => s.categoryName);
    expect(displayNames).toContain('Novice');
    expect(displayNames).toContain('Advanced Beginner');
    expect(displayNames).toContain('Competent');
    expect(displayNames).toContain('Proficient');
    expect(displayNames).toContain('Expert');
  });

  it('should handle missing difficulty levels gracefully', () => {
    const questions: Question[] = [
      createQuestion(1, 'novice'),
      createQuestion(2, 'expert'),
    ];

    const userAnswers: UserAnswer[] = [
      createUserAnswer(1, true),
      createUserAnswer(2, false),
    ];

    const scores = calculateFluencyLevelScores(questions, userAnswers);

    // Should still return all 5 difficulty levels
    expect(scores).toHaveLength(5);

    // Levels without questions should have 0 totalQuestions
    const competent = scores.find((s) => s.categoryId === 'competent');
    expect(competent?.totalQuestions).toBe(0);
    expect(competent?.percentage).toBe(0);
  });

  it('should handle empty questions array', () => {
    const scores = calculateFluencyLevelScores([], []);

    expect(scores).toHaveLength(5);
    scores.forEach((score) => {
      expect(score.score).toBe(0);
      expect(score.totalQuestions).toBe(0);
      expect(score.percentage).toBe(0);
    });
  });
});
