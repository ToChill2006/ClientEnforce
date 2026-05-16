-- New scope table for external_viewer role
CREATE TABLE IF NOT EXISTS external_viewer_scopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_external_viewer_scopes_user ON external_viewer_scopes(user_id, org_id);

-- RLS
ALTER TABLE external_viewer_scopes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org members can manage scopes" ON external_viewer_scopes
  USING (org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid()));
