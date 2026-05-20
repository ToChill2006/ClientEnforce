-- Extend event status to support automatic in_progress / completed transitions
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE public.events
  ADD CONSTRAINT events_status_check
  CHECK (status IN ('planning','active','in_progress','completed','closed','archived'));
