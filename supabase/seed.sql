-- ============================================================================
-- AI FLUENCY EXPLORER - SEED DATA
-- Run after migrations to populate initial categories
-- Questions are seeded via the app's admin panel or devUtils
-- ============================================================================

-- Insert categories
INSERT INTO public.categories (name, description) VALUES
  ('Prompt Engineering', 'Creating effective prompts and interactions with AI'),
  ('AI Ethics', 'Responsible and ethical use of AI technologies'),
  ('Technical Concepts', 'Understanding how AI works and its technical underpinnings'),
  ('Practical Applications', 'Real-world use cases and applications of AI')
ON CONFLICT (name) DO NOTHING;

-- Note: Questions are seeded from src/data/questions.json via the app.
-- After starting the app, use one of these methods to populate questions:
--
-- Method 1: Admin Panel
--   1. Sign up and make yourself admin: SELECT public.add_user_role('your@email.com', 'admin');
--   2. Go to /admin in the app
--   3. Click "Initialize Database" or "Run Migration"
--
-- Method 2: Browser Console (development)
--   1. Open browser dev tools
--   2. Run: window.devUtils.migrateJsonData()
--
-- Method 3: Manual SQL (see src/data/questions.json for full list)
--   Use the admin_insert_question() function
