-- Overall onboarding deadline
ALTER TABLE public.onboardings ADD COLUMN IF NOT EXISTS deadline DATE;

-- Event submission deadline (separate from end_date which is the event date)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS submission_deadline DATE;

-- Index for querying upcoming/overdue onboardings
CREATE INDEX IF NOT EXISTS onboardings_deadline_idx
  ON public.onboardings (org_id, deadline)
  WHERE deadline IS NOT NULL;
