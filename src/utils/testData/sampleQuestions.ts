
import type { Question } from '../testData';

// Define sample questions 
const sampleQuestions: Question[] = [
  {
    id: 101,
    text: "Deep learning models require large amounts of labeled data to train effectively.",
    correctAnswer: true,
    category: "advanced-beginner",
    difficulty: "advanced-beginner"
  },
  {
    id: 102,
    text: "Natural language processing can accurately understand context and sarcasm as well as humans in all cases.",
    correctAnswer: false,
    category: "competent",
    difficulty: "competent"
  },
  // Add more sample questions as needed
];

export default sampleQuestions;
