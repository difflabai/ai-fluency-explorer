-- Add Demo Assessment test type
INSERT INTO public.test_types (name, description, question_limit, is_active)
VALUES
  ('Demo Assessment', 'A quick 10-question demo to try the platform', 10, true)
ON CONFLICT (name) DO NOTHING;

-- Populate demo questions (if the function exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'populate_test_questions') THEN
    PERFORM populate_test_questions('Demo Assessment', 10);
  END IF;
END $$;
