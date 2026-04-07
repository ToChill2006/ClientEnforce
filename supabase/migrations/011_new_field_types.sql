-- Add checkbox and heading to the requirement_type enum.
-- NOTE: ALTER TYPE ... ADD VALUE cannot run inside a transaction — each statement must be separate.
ALTER TYPE public.requirement_type ADD VALUE IF NOT EXISTS 'checkbox';
ALTER TYPE public.requirement_type ADD VALUE IF NOT EXISTS 'heading';

-- metadata: stores per-type config snapshotted from the template definition.
-- Keys used: file_mode ("upload"|"link"), link_url, allow_multi_select, include_other, multiline.
ALTER TABLE public.onboarding_requirements
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- file_paths: JSON array of "bucket:path" strings for multi-file upload requirements.
-- Supersedes the single-value file_path column for requirements that allow multiple files.
ALTER TABLE public.onboarding_requirements
  ADD COLUMN IF NOT EXISTS file_paths JSONB;
