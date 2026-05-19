-- Planning board posts for events
CREATE TABLE IF NOT EXISTS public.event_board_posts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID        NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  org_id      UUID        NOT NULL,
  author_id   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  body        TEXT,
  file_path   TEXT,
  file_name   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS event_board_posts_event_idx
  ON public.event_board_posts (event_id, created_at DESC);

CREATE INDEX IF NOT EXISTS event_board_posts_org_idx
  ON public.event_board_posts (org_id);

-- Team chat messages
CREATE TABLE IF NOT EXISTS public.team_messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID        NOT NULL,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT,
  body        TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS team_messages_org_idx
  ON public.team_messages (org_id, created_at DESC);
