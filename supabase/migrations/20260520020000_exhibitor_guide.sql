-- Exhibitor guide stored as JSONB on the events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS exhibitor_guide JSONB;
