
-- Drop the existing function
DROP FUNCTION IF EXISTS public.populate_test_questions(text, integer);

-- Create an improved function that ensures balanced distribution
CREATE OR REPLACE FUNCTION public.populate_test_questions(test_type_name text, question_limit integer DEFAULT NULL::integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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
  
  -- Strategy 1: Distribute evenly across categories first, then difficulties within each category
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
