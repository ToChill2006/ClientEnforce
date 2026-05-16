CREATE TABLE IF NOT EXISTS reminder_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  phase_number INT,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('deadline_based', 'inactivity_based', 'missing_item_based')),
  trigger_offset_days INT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reminder_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES reminder_rules(id) ON DELETE CASCADE,
  onboarding_id UUID NOT NULL REFERENCES onboardings(id) ON DELETE CASCADE,
  phase_number INT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rule_id, onboarding_id, phase_number)
);

CREATE INDEX IF NOT EXISTS idx_reminder_rules_template ON reminder_rules(template_id, org_id);
CREATE INDEX IF NOT EXISTS idx_reminder_sends_rule ON reminder_sends(rule_id, onboarding_id);

ALTER TABLE reminder_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org members can manage reminder rules" ON reminder_rules
  USING (org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid()));

ALTER TABLE reminder_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org members can view reminder sends" ON reminder_sends
  USING (rule_id IN (SELECT id FROM reminder_rules WHERE org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid())));
