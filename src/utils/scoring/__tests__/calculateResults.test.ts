import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateResults } from '../calculateResults';
import { Question, UserAnswer } from '../../testData';

// Suppress console logs in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('calculateResults', () => {
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

  it('should calculate 0% score when all answers are false', () => {
    const questions: Question[] = [
      createQuestion(1, '1', 'novice'),
      createQuestion(2, '2', 'novice'),
      createQuestion(3, '3', 'novice'),
    ];

    const userAnswers: UserAnswer[] = [
      createUserAnswer(1, false),
      createUserAnswer(2, false),
      createUserAnswer(3, false),
    ];

    const result = calculateResults(questions, userAnswers);

    expect(result.overallScore).toBe(0);
    expect(result.maxPossibleScore).toBe(3);
    expect(result.percentageScore).toBe(0);
    expect(result.tier.name).toBe('Novice');
  });

  it('should calculate 100% score when all answers are true', () => {
    const questions: Question[] = [
      createQuestion(1, '1', 'novice'),
      createQuestion(2, '2', 'novice'),
      createQuestion(3, '3', 'novice'),
    ];

    const userAnswers: UserAnswer[] = [
      createUserAnswer(1, true),
      createUserAnswer(2, true),
      createUserAnswer(3, true),
    ];

    const result = calculateResults(questions, userAnswers);

    expect(result.overallScore).toBe(3);
    expect(result.maxPossibleScore).toBe(3);
    expect(result.percentageScore).toBe(100);
  });

  it('should calculate partial scores correctly', () => {
    const questions: Question[] = [
      createQuestion(1, '1', 'novice'),
      createQuestion(2, '2', 'novice'),
      createQuestion(3, '3', 'novice'),
      createQuestion(4, '4', 'novice'),
    ];

    const userAnswers: UserAnswer[] = [
      createUserAnswer(1, true),
      createUserAnswer(2, false),
      createUserAnswer(3, true),
      createUserAnswer(4, false),
    ];

    const result = calculateResults(questions, userAnswers);

    expect(result.overallScore).toBe(2);
    expect(result.maxPossibleScore).toBe(4);
    expect(result.percentageScore).toBe(50);
  });

  it('should include categoryScores in result', () => {
    const questions: Question[] = [
      createQuestion(1, '1', 'novice'),
      createQuestion(2, '2', 'competent'),
    ];

    const userAnswers: UserAnswer[] = [
      createUserAnswer(1, true),
      createUserAnswer(2, true),
    ];

    const result = calculateResults(questions, userAnswers);

    expect(result.categoryScores).toBeDefined();
    expect(Array.isArray(result.categoryScores)).toBe(true);
  });

  it('should include timestamp in result', () => {
    const questions: Question[] = [createQuestion(1, '1', 'novice')];
    const userAnswers: UserAnswer[] = [createUserAnswer(1, true)];

    const before = new Date();
    const result = calculateResults(questions, userAnswers);
    const after = new Date();

    expect(result.timestamp).toBeInstanceOf(Date);
    expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(result.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should handle empty questions array', () => {
    const questions: Question[] = [];
    const userAnswers: UserAnswer[] = [];

    const result = calculateResults(questions, userAnswers);

    expect(result.overallScore).toBe(0);
    expect(result.maxPossibleScore).toBe(0);
    expect(Number.isNaN(result.percentageScore)).toBe(true); // 0/0 = NaN
  });

  it('should determine correct tier based on score', () => {
    // Create 40 questions to test tier boundaries
    const questions: Question[] = Array.from({ length: 40 }, (_, i) =>
      createQuestion(i + 1, '1', 'novice')
    );

    // All true answers gives score of 40, which is Advanced Beginner (37-72)
    const userAnswers: UserAnswer[] = questions.map((q) =>
      createUserAnswer(q.id, true)
    );

    const result = calculateResults(questions, userAnswers);

    expect(result.overallScore).toBe(40);
    expect(result.tier.name).toBe('Advanced Beginner');
  });
});
