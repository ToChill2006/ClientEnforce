-- Enhance planning board posts with priority, type, and pinning
ALTER TABLE public.event_board_posts
  ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS post_type TEXT NOT NULL DEFAULT 'note',
  ADD COLUMN IF NOT EXISTS pinned BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS event_board_posts_pinned_idx
  ON public.event_board_posts (event_id, pinned) WHERE pinned = TRUE;
