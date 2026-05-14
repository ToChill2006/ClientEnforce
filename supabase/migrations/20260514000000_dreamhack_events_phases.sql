-- ============================================================
-- DreamHack Enterprise Onboarding Build
-- Stages 0 + 1: Feature flags, Events, Client Types, Phases
-- ============================================================

-- Stage 0: Feature flags JSONB column on organizations
alter table public.organizations
  add column if not exists feature_flags jsonb not null default '{}'::jsonb;

create index if not exists organizations_feature_flags_idx
  on public.organizations using gin (feature_flags);

-- ============================================================
-- Stage 1: New tables
-- ============================================================

-- Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  start_date date,
  end_date date not null,
  location text,
  status text not null default 'planning'
    check (status in ('planning','active','closed','archived')),
  created_by_user_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists events_org_status_idx on public.events(org_id, status);
alter table public.events enable row level security;
create policy events_org_isolation on public.events
  for all using (
    org_id in (select org_id from public.profiles where user_id = auth.uid())
  );

-- Client Types
create table if not exists public.client_types (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  default_template_id uuid references public.templates(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, name)
);
alter table public.client_types enable row level security;
create policy client_types_org_isolation on public.client_types
  for all using (
    org_id in (select org_id from public.profiles where user_id = auth.uid())
  );

-- Phase records
create table if not exists public.onboarding_phases (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  onboarding_id uuid not null references public.onboardings(id) on delete cascade,
  phase_number int not null,
  name text not null,
  deadline date,
  status text not null default 'locked'
    check (status in ('locked','in_progress','awaiting_review','approved','rejected')),
  reviewer_id uuid references auth.users(id) on delete set null,
  reviewer_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (onboarding_id, phase_number)
);
create index if not exists onboarding_phases_org_status_idx
  on public.onboarding_phases(org_id, status);
create index if not exists onboarding_phases_onboarding_idx
  on public.onboarding_phases(onboarding_id);
alter table public.onboarding_phases enable row level security;
create policy onboarding_phases_org_isolation on public.onboarding_phases
  for all using (
    org_id in (select org_id from public.profiles where user_id = auth.uid())
  );

-- Team activity feed
create table if not exists public.team_activity (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_kind text not null,       -- 'user' | 'exhibitor' | 'system'
  verb text not null,              -- 'approved' | 'rejected' | 'submitted' | 'invited' | 'created'
  subject_kind text not null,     -- 'phase' | 'onboarding' | 'event'
  subject_id uuid,
  context jsonb,                   -- { event_id, onboarding_id, phase_number, ... }
  created_at timestamptz not null default now()
);
create index if not exists team_activity_org_created_idx
  on public.team_activity(org_id, created_at desc);
alter table public.team_activity enable row level security;
create policy team_activity_org_isolation on public.team_activity
  for all using (
    org_id in (select org_id from public.profiles where user_id = auth.uid())
  );

-- ============================================================
-- Stage 1: Column additions to existing tables
-- ============================================================

-- Default client type on clients (optional global default)
alter table public.clients
  add column if not exists default_client_type_id uuid
    references public.client_types(id) on delete set null;

-- Link onboardings to events and client types
alter table public.onboardings
  add column if not exists event_id uuid
    references public.events(id) on delete set null,
  add column if not exists client_type_id uuid
    references public.client_types(id) on delete set null;

create index if not exists onboardings_event_idx on public.onboardings(event_id);
create index if not exists onboardings_client_type_idx on public.onboardings(client_type_id);

-- Phase number on requirements (nullable — legacy templates without phases still work)
alter table public.onboarding_requirements
  add column if not exists phase_number int;

-- Per-requirement review state
alter table public.onboarding_requirements
  add column if not exists review_status text default 'pending'
    check (review_status in ('pending','approved','needs_revision')),
  add column if not exists reviewer_comment text;

-- ============================================================
-- Stage 1: Extend role enum (or leave as text — handled at app layer)
-- ============================================================
do $$ begin
  if exists (select 1 from pg_type where typname = 'org_role') then
    begin
      alter type org_role add value if not exists 'onboarder';
    exception when others then null; end;
    begin
      alter type org_role add value if not exists 'reviewer';
    exception when others then null; end;
  end if;
end $$;
