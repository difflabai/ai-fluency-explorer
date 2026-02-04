-- Add Quick Start test type (curated 10-question intro assessment)
-- Note: Quick Start uses hard-coded question IDs in the frontend (questionFetchService.ts)
-- and doesn't rely on test_questions_map for question selection
INSERT INTO public.test_types (name, description, question_limit, is_active)
VALUES
  ('Quick Start', 'A curated 10-question intro to gauge your AI fluency', 10, true)
ON CONFLICT (name) DO NOTHING;
