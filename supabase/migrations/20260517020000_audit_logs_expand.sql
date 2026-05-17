-- Expand audit_logs for comprehensive logging

-- Change action from strict enum to free-form text
ALTER TABLE public.audit_logs
  ALTER COLUMN action TYPE text;

-- Add actor context columns (already available in audit_events, now bring to audit_logs)
ALTER TABLE public.audit_logs
  ADD COLUMN IF NOT EXISTS actor_email text,
  ADD COLUMN IF NOT EXISTS actor_role text,
  ADD COLUMN IF NOT EXISTS onboarding_id uuid REFERENCES public.onboardings(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS audit_logs_onboarding_id_idx
  ON public.audit_logs (onboarding_id) WHERE onboarding_id IS NOT NULL;
