-- Onboarding messages: two-way chat between admins and clients
CREATE TABLE IF NOT EXISTS public.onboarding_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id UUID NOT NULL REFERENCES public.onboardings(id) ON DELETE CASCADE,
  org_id      TEXT NOT NULL,
  -- 'admin' = sent by an org member; 'client' = sent by the exhibitor
  sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'client')),
  sender_name TEXT,
  sender_email TEXT,
  body        TEXT NOT NULL CHECK (char_length(body) > 0 AND char_length(body) <= 4000),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS onboarding_messages_onboarding_id_idx
  ON public.onboarding_messages (onboarding_id, created_at);

ALTER TABLE public.onboarding_messages ENABLE ROW LEVEL SECURITY;

-- Org members can do everything on their org's messages
CREATE POLICY "org_members_all_messages" ON public.onboarding_messages
  FOR ALL
  USING (
    org_id IN (
      SELECT p.org_id FROM public.profiles p WHERE p.user_id = auth.uid()
    )
  );
