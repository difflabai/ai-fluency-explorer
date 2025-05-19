
import type { Question } from '../testData';

// Define quick assessment questions
const quickAssessmentQuestions: Question[] = [
  {
    id: 1,
    text: "AI can completely replace human judgment in all decision-making scenarios.",
    correctAnswer: false,
    category: "novice",
    difficulty: "novice"
  },
  {
    id: 2,
    text: "Machine learning is a subset of artificial intelligence.",
    correctAnswer: true,
    category: "novice",
    difficulty: "novice"
  },
  // Add more sample questions as needed
];

export default quickAssessmentQuestions;
