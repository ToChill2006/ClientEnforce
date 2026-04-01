-- Add optional attachment column for org-provided form templates
-- Stores a bucket:path reference to a file the org uploaded (e.g. a PDF form to fill out)
-- The client's uploaded response continues to go in file_path (unchanged)
ALTER TABLE public.onboarding_requirements
  ADD COLUMN IF NOT EXISTS attachment_path TEXT;
