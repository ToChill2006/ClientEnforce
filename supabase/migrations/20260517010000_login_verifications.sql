-- Login verification codes — 6-digit codes sent via Resend after password check
CREATE TABLE IF NOT EXISTS public.login_verifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS login_verifications_email_idx
  ON public.login_verifications (email, expires_at DESC);

ALTER TABLE public.login_verifications ENABLE ROW LEVEL SECURITY;
