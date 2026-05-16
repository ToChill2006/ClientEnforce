-- Add payment columns to onboarding_requirements
ALTER TABLE onboarding_requirements
  ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS payment_currency TEXT,
  ADD COLUMN IF NOT EXISTS payment_description TEXT,
  ADD COLUMN IF NOT EXISTS payment_stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'not_paid';

-- Add Stripe Connect account to orgs
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;

CREATE INDEX IF NOT EXISTS idx_req_payment_session
  ON onboarding_requirements(payment_stripe_session_id)
  WHERE payment_stripe_session_id IS NOT NULL;

-- Idempotency table for webhook events
CREATE TABLE IF NOT EXISTS processed_webhook_events (
  id TEXT PRIMARY KEY,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
