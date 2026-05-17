-- ── Cron lock table ──────────────────────────────────────────────────────────
-- Prevents concurrent cron runs from sending duplicate emails.
CREATE TABLE IF NOT EXISTS public.cron_locks (
  job_name TEXT PRIMARY KEY,
  locked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_until TIMESTAMPTZ NOT NULL
);

ALTER TABLE public.cron_locks ENABLE ROW LEVEL SECURITY;
-- Only service role accesses this table — no RLS policies needed.

-- ── OTP rate limit table ─────────────────────────────────────────────────────
-- Tracks OTP send attempts per email for server-side rate limiting.
CREATE TABLE IF NOT EXISTS public.otp_rate_limits (
  email TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS otp_rate_limits_email_sent_idx ON public.otp_rate_limits (email, sent_at DESC);
ALTER TABLE public.otp_rate_limits ENABLE ROW LEVEL SECURITY;

-- Auto-purge entries older than 1 hour (keep the table lean)
CREATE OR REPLACE FUNCTION public.purge_old_otp_rate_limits() RETURNS void
  LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM public.otp_rate_limits WHERE sent_at < now() - INTERVAL '1 hour';
END;
$$;

-- ── processed_webhook_events index ───────────────────────────────────────────
-- Ensure there's a proper unique constraint (may already exist, use IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'processed_webhook_events_id_key'
      AND conrelid = 'public.processed_webhook_events'::regclass
  ) THEN
    ALTER TABLE public.processed_webhook_events ADD CONSTRAINT processed_webhook_events_id_key UNIQUE (id);
  END IF;
EXCEPTION WHEN undefined_table THEN
  -- Table doesn't exist yet — it will be created by payment_fields migration
  NULL;
END $$;
