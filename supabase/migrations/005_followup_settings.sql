begin;

-- Add per-org follow-up configuration
alter table public.organizations
  add column if not exists followup_delay_days integer not null default 3,
  add column if not exists followup_max_count integer not null default 3,
  add column if not exists followup_send_hour integer not null default 9,
  add column if not exists followup_timezone text not null default 'UTC';

-- Basic guardrails
alter table public.organizations
  drop constraint if exists organizations_followup_delay_days_check;
alter table public.organizations
  add constraint organizations_followup_delay_days_check
  check (followup_delay_days between 1 and 30);

alter table public.organizations
  drop constraint if exists organizations_followup_max_count_check;
alter table public.organizations
  add constraint organizations_followup_max_count_check
  check (followup_max_count between 0 and 10);

alter table public.organizations
  drop constraint if exists organizations_followup_send_hour_check;
alter table public.organizations
  add constraint organizations_followup_send_hour_check
  check (followup_send_hour between 0 and 23);

commit;