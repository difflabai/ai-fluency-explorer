
export interface DBQuestion {
  id: string;
  text: string;
  category_id: string;
  difficulty: 'novice' | 'advanced-beginner' | 'competent' | 'proficient' | 'expert';
  version: number;
  is_active: boolean;
  correct_answer: boolean;
  explanation: string | null;
  created_at: string;
  updated_at: string;
  parent_question_id: string | null;
}

export interface DBCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface DBTestType {
  id: string;
  name: string;
  description: string | null;
  question_limit: number | null;
  created_at: string;
  is_active: boolean;
}
