-- ============================================================================
-- AI FLUENCY ASSESSMENT PLATFORM - COMPLETE DATABASE SCHEMA
-- Generated: 2026-02-03
-- This migration recreates the entire database schema from scratch
-- ============================================================================

-- ============================================================================
-- SECTION 1: ENUMS
-- ============================================================================

-- Difficulty levels for questions (Dreyfus model)
CREATE TYPE public.difficulty_level AS ENUM (
  'novice',
  'advanced-beginner',
  'competent',
  'proficient',
  'expert'
);

-- User roles for access control
CREATE TYPE public.user_role AS ENUM (
  'admin',
  'user'
);

-- ============================================================================
-- SECTION 2: TABLES
-- ============================================================================

-- -----------------------------------------------------------------------------
-- Categories Table
-- Stores question categories/domains for the assessment
-- -----------------------------------------------------------------------------
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Questions Table
-- Stores all assessment questions with versioning support
-- -----------------------------------------------------------------------------
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  difficulty public.difficulty_level NOT NULL,
  correct_answer BOOLEAN NOT NULL,
  explanation TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  parent_question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Index for faster category lookups
CREATE INDEX idx_questions_category_id ON public.questions(category_id);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX idx_questions_is_active ON public.questions(is_active);

-- -----------------------------------------------------------------------------
-- Test Types Table
-- Defines different assessment types (Quick vs Comprehensive)
-- -----------------------------------------------------------------------------
CREATE TABLE public.test_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  question_limit INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.test_types ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Test Questions Map Table
-- Maps questions to test types for flexible test composition
-- -----------------------------------------------------------------------------
CREATE TABLE public.test_questions_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_type_id UUID NOT NULL REFERENCES public.test_types(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(test_type_id, question_id)
);

-- Enable RLS
ALTER TABLE public.test_questions_map ENABLE ROW LEVEL SECURITY;

-- Indexes for faster lookups
CREATE INDEX idx_test_questions_map_test_type ON public.test_questions_map(test_type_id);
CREATE INDEX idx_test_questions_map_question ON public.test_questions_map(question_id);

-- -----------------------------------------------------------------------------
-- Test Results Table
-- Stores completed assessment results with scoring data
-- -----------------------------------------------------------------------------
CREATE TABLE public.test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  username TEXT,
  overall_score INTEGER NOT NULL,
  max_possible_score INTEGER NOT NULL,
  percentage_score NUMERIC NOT NULL,
  tier_name TEXT NOT NULL,
  category_scores JSONB NOT NULL,
  questions_snapshot JSONB,
  public BOOLEAN NOT NULL DEFAULT false,
  share_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  is_test_data BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_test_results_user_id ON public.test_results(user_id);
CREATE INDEX idx_test_results_share_id ON public.test_results(share_id);
CREATE INDEX idx_test_results_public ON public.test_results(public);
CREATE INDEX idx_test_results_created_at ON public.test_results(created_at DESC);
CREATE INDEX idx_test_results_percentage_score ON public.test_results(percentage_score DESC);

-- -----------------------------------------------------------------------------
-- User Answers Table
-- Stores individual question responses for each test attempt
-- -----------------------------------------------------------------------------
CREATE TABLE public.user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  test_result_id UUID NOT NULL REFERENCES public.test_results(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE RESTRICT,
  answer BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_user_answers_test_result ON public.user_answers(test_result_id);
CREATE INDEX idx_user_answers_user_id ON public.user_answers(user_id);

-- -----------------------------------------------------------------------------
-- User Roles Table
-- Stores user role assignments (admin, user)
-- SECURITY: Roles stored separately to prevent privilege escalation
-- -----------------------------------------------------------------------------
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Index
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- ============================================================================
-- SECTION 3: SECURITY DEFINER FUNCTIONS
-- These functions run with elevated privileges to avoid RLS recursion
-- ============================================================================

-- -----------------------------------------------------------------------------
-- is_admin: Check if a user has admin role
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = $1 
    AND role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- current_user_role: Get the current user's role
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- -----------------------------------------------------------------------------
-- check_category_exists: Check if a category exists by name
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_category_exists(category_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_id UUID;
BEGIN
  SELECT id INTO existing_id
  FROM public.categories
  WHERE name = category_name;
  
  RETURN existing_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- admin_insert_category: Insert a new category (admin only)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_insert_category(
  category_name TEXT,
  category_description TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.categories (name, description)
  VALUES (category_name, category_description)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- admin_insert_question: Insert a new question (admin only)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_insert_question(
  question_text TEXT,
  category_id UUID,
  difficulty TEXT,
  correct_answer BOOLEAN,
  explanation_text TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.questions (
    text, 
    category_id,
    difficulty,
    correct_answer,
    explanation,
    is_active,
    version
  )
  VALUES (
    question_text,
    category_id,
    difficulty::public.difficulty_level,
    correct_answer,
    explanation_text,
    true,
    1
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- create_question_version: Create a new version of an existing question
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_question_version(
  question_id UUID,
  new_text TEXT,
  new_category_id UUID,
  new_difficulty public.difficulty_level,
  new_correct_answer BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  old_version INTEGER;
  new_version INTEGER;
  new_question_id UUID;
BEGIN
  -- Get the current version of the question
  SELECT version INTO old_version FROM public.questions WHERE id = question_id;
  
  -- Calculate the new version
  new_version := old_version + 1;
  
  -- Insert the new version of the question
  INSERT INTO public.questions (
    text, 
    category_id, 
    difficulty, 
    version, 
    correct_answer, 
    parent_question_id
  )
  VALUES (
    new_text, 
    new_category_id, 
    new_difficulty, 
    new_version, 
    new_correct_answer, 
    question_id
  )
  RETURNING id INTO new_question_id;
  
  -- Mark the old version as inactive
  UPDATE public.questions SET is_active = false WHERE id = question_id;
  
  RETURN new_question_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- add_user_role: Add a role to a user by email
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.add_user_role(
  user_email TEXT,
  role_name TEXT DEFAULT 'user'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_user_id UUID;
  role_exists BOOLEAN;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Check if role already exists
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = target_user_id
    AND role::text = role_name
  ) INTO role_exists;
  
  -- If role doesn't exist, add it
  IF NOT role_exists THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, role_name::public.user_role);
  END IF;
  
  RETURN true;
END;
$$;

-- -----------------------------------------------------------------------------
-- populate_test_questions: Populate test type with balanced question selection
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.populate_test_questions(
  test_type_name TEXT,
  question_limit INTEGER DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  test_id UUID;
  question_count INTEGER := 0;
  total_categories INTEGER;
  total_difficulties INTEGER;
  questions_per_category INTEGER;
  questions_per_difficulty INTEGER;
  remaining_questions INTEGER;
BEGIN
  -- Get test type ID
  SELECT id INTO test_id FROM public.test_types WHERE name = test_type_name;
  
  IF test_id IS NULL THEN
    RAISE EXCEPTION 'Test type % not found', test_type_name;
  END IF;
  
  -- Clear any existing mappings for this test
  DELETE FROM public.test_questions_map WHERE test_type_id = test_id;
  
  -- If no limit specified, add all active questions
  IF question_limit IS NULL THEN
    INSERT INTO public.test_questions_map (test_type_id, question_id)
    SELECT test_id, id FROM public.questions WHERE is_active = true;
    
    GET DIAGNOSTICS question_count = ROW_COUNT;
    RETURN question_count;
  END IF;
  
  -- Get counts for balanced distribution
  SELECT COUNT(DISTINCT category_id) INTO total_categories
  FROM public.questions WHERE is_active = true;
  
  SELECT COUNT(DISTINCT difficulty) INTO total_difficulties
  FROM public.questions WHERE is_active = true;
  
  -- Calculate questions per category and difficulty
  questions_per_category := GREATEST(1, question_limit / total_categories);
  questions_per_difficulty := GREATEST(1, question_limit / total_difficulties);
  
  -- Strategy: Distribute evenly across categories first, then difficulties within each category
  WITH category_distribution AS (
    SELECT 
      category_id,
      difficulty,
      ROW_NUMBER() OVER (
        PARTITION BY category_id, difficulty 
        ORDER BY RANDOM()
      ) as rn_within_category_difficulty,
      ROW_NUMBER() OVER (
        PARTITION BY category_id 
        ORDER BY 
          CASE difficulty
            WHEN 'novice' THEN 1
            WHEN 'advanced-beginner' THEN 2
            WHEN 'competent' THEN 3
            WHEN 'proficient' THEN 4
            WHEN 'expert' THEN 5
          END,
          RANDOM()
      ) as rn_within_category
    FROM public.questions 
    WHERE is_active = true
  ),
  selected_questions AS (
    SELECT 
      q.id,
      ROW_NUMBER() OVER (ORDER BY 
        cd.category_id,
        CASE q.difficulty
          WHEN 'novice' THEN 1
          WHEN 'advanced-beginner' THEN 2
          WHEN 'competent' THEN 3
          WHEN 'proficient' THEN 4
          WHEN 'expert' THEN 5
        END,
        RANDOM()
      ) as final_order
    FROM public.questions q
    JOIN category_distribution cd ON q.id = cd.id
    WHERE cd.rn_within_category <= questions_per_category
      AND cd.rn_within_category_difficulty <= 2  -- Max 2 questions per difficulty within each category
  )
  INSERT INTO public.test_questions_map (test_type_id, question_id)
  SELECT test_id, id
  FROM selected_questions
  WHERE final_order <= question_limit;
  
  GET DIAGNOSTICS question_count = ROW_COUNT;
  
  -- If we didn't get enough questions, fill remaining slots randomly
  remaining_questions := question_limit - question_count;
  
  IF remaining_questions > 0 THEN
    INSERT INTO public.test_questions_map (test_type_id, question_id)
    SELECT test_id, q.id
    FROM public.questions q
    WHERE q.is_active = true
      AND q.id NOT IN (
        SELECT question_id 
        FROM public.test_questions_map 
        WHERE test_type_id = test_id
      )
    ORDER BY RANDOM()
    LIMIT remaining_questions;
    
    GET DIAGNOSTICS remaining_questions = ROW_COUNT;
    question_count := question_count + remaining_questions;
  END IF;
  
  RETURN question_count;
END;
$$;

-- ============================================================================
-- SECTION 4: ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- -----------------------------------------------------------------------------
-- Categories Policies
-- -----------------------------------------------------------------------------

-- Public read access
CREATE POLICY "Allow public read access to categories"
ON public.categories FOR SELECT
USING (true);

-- Authenticated users can insert (for migration purposes)
CREATE POLICY "Allow insert access to categories for authenticated users"
ON public.categories FOR INSERT
WITH CHECK (true);

-- Service role has full access
CREATE POLICY "Allow service role to manage categories"
ON public.categories FOR ALL
USING (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- Questions Policies
-- -----------------------------------------------------------------------------

-- Public read access
CREATE POLICY "Allow public read access to questions"
ON public.questions FOR SELECT
USING (true);

-- Authenticated users can insert/update (for migration purposes)
CREATE POLICY "Allow insert/update access to questions for authenticated users"
ON public.questions FOR ALL
WITH CHECK (true);

-- Service role has full access
CREATE POLICY "Allow service role to manage questions"
ON public.questions FOR ALL
USING (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- Test Types Policies
-- -----------------------------------------------------------------------------

-- Public read access
CREATE POLICY "Allow public read access to test_types"
ON public.test_types FOR SELECT
USING (true);

-- Admin insert
CREATE POLICY "Allow admin insert on test_types"
ON public.test_types FOR INSERT
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Admin update
CREATE POLICY "Allow admin update on test_types"
ON public.test_types FOR UPDATE
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Admin delete
CREATE POLICY "Allow admin delete on test_types"
ON public.test_types FOR DELETE
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- -----------------------------------------------------------------------------
-- Test Questions Map Policies
-- -----------------------------------------------------------------------------

-- Public read access
CREATE POLICY "Allow public read access to test_questions_map"
ON public.test_questions_map FOR SELECT
USING (true);

-- Admin insert
CREATE POLICY "Allow admin insert on test_questions_map"
ON public.test_questions_map FOR INSERT
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Admin update
CREATE POLICY "Allow admin update on test_questions_map"
ON public.test_questions_map FOR UPDATE
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Admin delete
CREATE POLICY "Allow admin delete on test_questions_map"
ON public.test_questions_map FOR DELETE
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- -----------------------------------------------------------------------------
-- Test Results Policies
-- -----------------------------------------------------------------------------

-- Users can view their own results
CREATE POLICY "Users can view their own test results"
ON public.test_results FOR SELECT
USING (auth.uid() = user_id);

-- Anyone can view public results
CREATE POLICY "Anyone can view public test results"
ON public.test_results FOR SELECT
USING (public = true);

-- Anyone can view shared results (via share_id)
CREATE POLICY "Anyone can view shared test results"
ON public.test_results FOR SELECT
USING (true);

-- Hide test data from non-admins
CREATE POLICY "Hide test data from non-admins"
ON public.test_results FOR SELECT
USING (
  (is_test_data = false) OR 
  ((is_test_data = true) AND public.is_admin(auth.uid()))
);

-- Users can insert their own results
CREATE POLICY "Users can insert their own test results"
ON public.test_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own results
CREATE POLICY "Users can update their own test results"
ON public.test_results FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own results
CREATE POLICY "Users can delete their own test results"
ON public.test_results FOR DELETE
USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- User Answers Policies
-- -----------------------------------------------------------------------------

-- Users can view their own answers
CREATE POLICY "Allow users to select their own answers"
ON public.user_answers FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own answers
CREATE POLICY "Allow users to insert their own answers"
ON public.user_answers FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own answers
CREATE POLICY "Allow users to update their own answers"
ON public.user_answers FOR UPDATE
USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- User Roles Policies
-- -----------------------------------------------------------------------------

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- Admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- Admins can update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- Admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- ============================================================================
-- SECTION 5: SEED DATA
-- ============================================================================

-- Insert default test types
INSERT INTO public.test_types (name, description, question_limit, is_active)
VALUES 
  ('Quick Assessment', 'A quick 15-question assessment to gauge your AI fluency level', 15, true),
  ('Comprehensive Assessment', 'A thorough assessment covering all categories and difficulty levels', NULL, true)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SECTION 6: COMMENTS
-- ============================================================================

COMMENT ON TABLE public.categories IS 'Question categories/domains for AI fluency assessment';
COMMENT ON TABLE public.questions IS 'Assessment questions with versioning and difficulty levels';
COMMENT ON TABLE public.test_types IS 'Different types of assessments (Quick vs Comprehensive)';
COMMENT ON TABLE public.test_questions_map IS 'Maps questions to test types for flexible composition';
COMMENT ON TABLE public.test_results IS 'Completed assessment results with scoring data';
COMMENT ON TABLE public.user_answers IS 'Individual question responses for each test attempt';
COMMENT ON TABLE public.user_roles IS 'User role assignments for access control';

COMMENT ON FUNCTION public.is_admin IS 'Check if a user has admin role (security definer)';
COMMENT ON FUNCTION public.current_user_role IS 'Get the current authenticated users role';
COMMENT ON FUNCTION public.populate_test_questions IS 'Populate a test type with balanced question selection';
