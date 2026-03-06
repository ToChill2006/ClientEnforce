-- 006_audit_events.sql
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid null, -- dashboard user
  actor_email text null,
  actor_role text null,

  -- what happened
  action text not null, -- e.g. onboarding.created, file.uploaded, signature.saved
  entity_type text null, -- onboarding, client, template, followup, file, signature
  entity_id uuid null,
  onboarding_id uuid null references public.onboardings(id) on delete cascade,

  -- extra details
  meta jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists audit_events_org_id_created_at_idx
  on public.audit_events(org_id, created_at desc);

create index if not exists audit_events_onboarding_id_created_at_idx
  on public.audit_events(onboarding_id, created_at desc);

alter table public.audit_events enable row level security;

-- RLS: only org members can read
-- (this project uses `public.memberships`)
drop policy if exists "audit_events_read_org_members" on public.audit_events;
create policy "audit_events_read_org_members"
on public.audit_events
for select
using (
  exists (
    select 1
    from public.memberships m
    where m.org_id = audit_events.org_id
      and m.user_id = auth.uid()
  )
);

-- inserts should be done server-side using service role key,
-- so you usually don't need an insert policy for client-side.