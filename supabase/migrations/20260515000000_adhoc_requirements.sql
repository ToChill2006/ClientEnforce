ALTER TABLE onboarding_requirements
  ADD COLUMN IF NOT EXISTS is_ad_hoc BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_onboarding_requirements_phase_sort
  ON onboarding_requirements(onboarding_id, phase_number, sort_order);
