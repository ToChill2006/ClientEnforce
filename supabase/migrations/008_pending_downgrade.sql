-- 008_pending_downgrade.sql
-- Adds support for scheduled downgrades at billing period end

alter table public.organizations
add column if not exists pending_tier text;

alter table public.organizations
add column if not exists pending_interval text;

alter table public.organizations
add column if not exists pending_seats_limit integer;

-- optional: add basic validation
alter table public.organizations
add constraint organizations_pending_tier_check
check (
  pending_tier is null
  or pending_tier in ('free','pro','business')
);

alter table public.organizations
add constraint organizations_pending_interval_check
check (
  pending_interval is null
  or pending_interval in ('monthly','yearly')
);