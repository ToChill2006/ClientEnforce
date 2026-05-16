-- Track when each side last read the conversation
CREATE TABLE IF NOT EXISTS public.onboarding_chat_reads (
  onboarding_id UUID NOT NULL REFERENCES public.onboardings(id) ON DELETE CASCADE,
  side          TEXT NOT NULL CHECK (side IN ('admin', 'client')),
  last_read_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (onboarding_id, side)
);

ALTER TABLE public.onboarding_chat_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_members_chat_reads" ON public.onboarding_chat_reads
  FOR ALL
  USING (
    onboarding_id IN (
      SELECT o.id FROM public.onboardings o
      JOIN public.memberships m ON m.org_id = o.org_id
      WHERE m.user_id = auth.uid()
    )
  );
