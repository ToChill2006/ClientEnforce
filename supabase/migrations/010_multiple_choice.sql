-- Add multiple_choice to the requirement_type enum
-- NOTE: ALTER TYPE ... ADD VALUE cannot run inside a transaction.
ALTER TYPE public.requirement_type ADD VALUE IF NOT EXISTS 'multiple_choice';

-- Add options column for storing the choice list (JSON array of strings)
ALTER TABLE public.onboarding_requirements
  ADD COLUMN IF NOT EXISTS options JSONB;
