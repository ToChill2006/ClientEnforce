-- Onboarding messages: two-way chat between admins and clients
-- Drop and recreate cleanly (table may exist from a failed prior attempt)
DROP TABLE IF EXISTS public.onboarding_messages CASCADE;

CREATE TABLE public.onboarding_messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id UUID NOT NULL REFERENCES public.onboardings(id) ON DELETE CASCADE,
  org_id        UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  -- 'admin' = sent by an org member; 'client' = sent by the exhibitor
  sender_type   TEXT NOT NULL CHECK (sender_type IN ('admin', 'client')),
  sender_name   TEXT,
  sender_email  TEXT,
  body          TEXT NOT NULL CHECK (char_length(body) > 0 AND char_length(body) <= 4000),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX onboarding_messages_onboarding_id_idx
  ON public.onboarding_messages (onboarding_id, created_at);

ALTER TABLE public.onboarding_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_members_all_messages" ON public.onboarding_messages
  FOR ALL
  USING (
    org_id IN (
      SELECT org_id FROM public.memberships WHERE user_id = auth.uid()
    )
  );
