-- ClientEnforce initial schema (multi-tenant, strict RLS)
-- Requires extensions:
-- - pgcrypto for gen_random_uuid()
-- - citext for case-insensitive emails (optional but useful)

begin;

create extension if not exists pgcrypto;
create extension if not exists citext;

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'member_role') then
    create type public.member_role as enum ('owner', 'admin', 'member');
  end if;

  if not exists (select 1 from pg_type where typname = 'subscription_tier') then
    create type public.subscription_tier as enum ('starter', 'pro', 'business');
  end if;

  if not exists (select 1 from pg_type where typname = 'audit_action') then
    create type public.audit_action as enum (
      'auth.signup',
      'auth.login',
      'org.created',
      'member.invited',
      'member.role_changed',
      'member.removed',
      'stripe.checkout_created',
      'stripe.webhook_processed',
      'onboarding.created',
      'onboarding.sent',
      'onboarding.client_started',
      'onboarding.client_submitted',
      'onboarding.locked',
      'cron.followup_sent'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'invite_status') then
    create type public.invite_status as enum ('pending', 'accepted', 'revoked', 'expired');
  end if;

  if not exists (select 1 from pg_type where typname = 'followup_status') then
    create type public.followup_status as enum ('queued', 'sent', 'cancelled', 'failed');
  end if;

  if not exists (select 1 from pg_type where typname = 'requirement_type') then
    create type public.requirement_type as enum ('text', 'file', 'signature');
  end if;
end $$;

-- ------------------------------------------------------------
-- TENANT TABLES
-- ------------------------------------------------------------

-- Organizations: tenant root
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  subscription_tier public.subscription_tier not null default 'starter',
  stripe_customer_id text,
  stripe_subscription_id text,
  seats_limit int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizations_owner_user_id_idx on public.organizations(owner_user_id);

-- Profiles: one per auth user
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  email citext not null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_org_id_idx on public.profiles(org_id);

-- Memberships: RBAC & team seats
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create index if not exists memberships_org_id_idx on public.memberships(org_id);
create index if not exists memberships_user_id_idx on public.memberships(user_id);

-- Invites: org admin invites teammates
create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  invited_email citext not null,
  role public.member_role not null default 'member',
  token text not null unique,
  status public.invite_status not null default 'pending',
  expires_at timestamptz not null,
  invited_by_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invites_org_id_idx on public.invites(org_id);

-- Templates (future phases will use; created now for FK integrity)
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  definition jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists templates_org_id_idx on public.templates(org_id);

-- Clients (future phases)
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  email citext not null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_org_id_idx on public.clients(org_id);

-- Onboardings (future phases; created now)
create table if not exists public.onboardings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  template_id uuid references public.templates(id) on delete set null,
  title text not null,
  client_token text not null unique,
  status text not null default 'draft', -- 'draft' | 'sent' | 'in_progress' | 'submitted' | 'locked'
  locked_at timestamptz,
  created_by_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onboardings_org_id_idx on public.onboardings(org_id);
create index if not exists onboardings_client_id_idx on public.onboardings(client_id);

-- Onboarding versions (snapshot)
create table if not exists public.onboarding_versions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  onboarding_id uuid not null references public.onboardings(id) on delete cascade,
  version int not null,
  template_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  unique (onboarding_id, version)
);

create index if not exists onboarding_versions_org_id_idx on public.onboarding_versions(org_id);
create index if not exists onboarding_versions_onboarding_id_idx on public.onboarding_versions(onboarding_id);

-- Requirements
create table if not exists public.onboarding_requirements (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  onboarding_id uuid not null references public.onboardings(id) on delete cascade,
  type public.requirement_type not null,
  label text not null,
  is_required boolean not null default true,
  sort_order int not null default 0,
  completed_at timestamptz,
  completed_by text, -- "client" or user_id; keep text for flexibility
  value_text text,
  file_path text,
  signature_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onboarding_requirements_org_id_idx on public.onboarding_requirements(org_id);
create index if not exists onboarding_requirements_onboarding_id_idx on public.onboarding_requirements(onboarding_id);

-- Follow-up jobs
create table if not exists public.followup_jobs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  onboarding_id uuid not null references public.onboardings(id) on delete cascade,
  to_email citext not null,
  subject text not null,
  body text not null,
  due_at timestamptz not null,
  status public.followup_status not null default 'queued',
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists followup_jobs_org_id_idx on public.followup_jobs(org_id);
create index if not exists followup_jobs_due_at_idx on public.followup_jobs(due_at);

-- Audit log
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action public.audit_action not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_org_id_idx on public.audit_logs(org_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at);

-- ------------------------------------------------------------
-- UPDATED_AT TRIGGERS
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'organizations_set_updated_at') then
    create trigger organizations_set_updated_at
    before update on public.organizations
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'profiles_set_updated_at') then
    create trigger profiles_set_updated_at
    before update on public.profiles
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'invites_set_updated_at') then
    create trigger invites_set_updated_at
    before update on public.invites
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'templates_set_updated_at') then
    create trigger templates_set_updated_at
    before update on public.templates
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'clients_set_updated_at') then
    create trigger clients_set_updated_at
    before update on public.clients
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'onboardings_set_updated_at') then
    create trigger onboardings_set_updated_at
    before update on public.onboardings
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'onboarding_requirements_set_updated_at') then
    create trigger onboarding_requirements_set_updated_at
    before update on public.onboarding_requirements
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'followup_jobs_set_updated_at') then
    create trigger followup_jobs_set_updated_at
    before update on public.followup_jobs
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- ------------------------------------------------------------
-- AUTH SIGNUP PROVISIONING (org + profile + membership)
-- ------------------------------------------------------------

create or replace function public.provision_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_email citext;
begin
  v_email := coalesce(new.email::citext, ''::citext);

  insert into public.organizations (owner_user_id, name, subscription_tier, seats_limit)
  values (new.id, 'My Organization', 'starter', 1)
  returning id into v_org_id;

  insert into public.profiles (user_id, org_id, email, full_name)
  values (new.id, v_org_id, v_email, null);

  insert into public.memberships (org_id, user_id, role)
  values (v_org_id, new.id, 'owner');

  insert into public.audit_logs (org_id, actor_user_id, action, entity_type, entity_id, metadata)
  values (v_org_id, new.id, 'auth.signup', 'user', new.id, jsonb_build_object('email', v_email));

  return new;
end;
$$;

revoke all on function public.provision_new_user() from public;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created_provision') then
    create trigger on_auth_user_created_provision
    after insert on auth.users
    for each row execute function public.provision_new_user();
  end if;
end $$;

-- ------------------------------------------------------------
-- RLS HELPERS
-- ------------------------------------------------------------

create or replace function public.current_user_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.org_id
  from public.profiles p
  where p.user_id = auth.uid()
$$;

revoke all on function public.current_user_org_id() from public;

create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships m
    where m.org_id = target_org
      and m.user_id = auth.uid()
  )
$$;

revoke all on function public.is_org_member(uuid) from public;

create or replace function public.has_org_role(target_org uuid, allowed_roles public.member_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships m
    where m.org_id = target_org
      and m.user_id = auth.uid()
      and m.role = any(allowed_roles)
  )
$$;

revoke all on function public.has_org_role(uuid, public.member_role[]) from public;

-- ------------------------------------------------------------
-- ENABLE RLS + POLICIES (no open access)
-- ------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.invites enable row level security;
alter table public.templates enable row level security;
alter table public.clients enable row level security;
alter table public.onboardings enable row level security;
alter table public.onboarding_versions enable row level security;
alter table public.onboarding_requirements enable row level security;
alter table public.followup_jobs enable row level security;
alter table public.audit_logs enable row level security;

-- organizations: member can read, owner/admin can update
drop policy if exists org_select_member on public.organizations;
create policy org_select_member
on public.organizations
for select
using (public.is_org_member(id));

drop policy if exists org_update_owner_admin on public.organizations;
create policy org_update_owner_admin
on public.organizations
for update
using (public.has_org_role(id, array['owner','admin']::public.member_role[]))
with check (public.has_org_role(id, array['owner','admin']::public.member_role[]));

-- profiles: users can read own profile; members can read profiles in org; only user can update own profile
drop policy if exists profiles_select_in_org on public.profiles;
create policy profiles_select_in_org
on public.profiles
for select
using (public.is_org_member(org_id));

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
on public.profiles
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- memberships: members can read membership list; only owner/admin can modify
drop policy if exists memberships_select_in_org on public.memberships;
create policy memberships_select_in_org
on public.memberships
for select
using (public.is_org_member(org_id));

drop policy if exists memberships_insert_owner_admin on public.memberships;
create policy memberships_insert_owner_admin
on public.memberships
for insert
with check (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

drop policy if exists memberships_update_owner_admin on public.memberships;
create policy memberships_update_owner_admin
on public.memberships
for update
using (public.has_org_role(org_id, array['owner','admin']::public.member_role[]))
with check (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

drop policy if exists memberships_delete_owner_admin on public.memberships;
create policy memberships_delete_owner_admin
on public.memberships
for delete
using (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

-- invites: only owner/admin; no open access
drop policy if exists invites_select_owner_admin on public.invites;
create policy invites_select_owner_admin
on public.invites
for select
using (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

drop policy if exists invites_insert_owner_admin on public.invites;
create policy invites_insert_owner_admin
on public.invites
for insert
with check (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

drop policy if exists invites_update_owner_admin on public.invites;
create policy invites_update_owner_admin
on public.invites
for update
using (public.has_org_role(org_id, array['owner','admin']::public.member_role[]))
with check (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

drop policy if exists invites_delete_owner_admin on public.invites;
create policy invites_delete_owner_admin
on public.invites
for delete
using (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

-- templates: org members can read; owner/admin can write
drop policy if exists templates_select_member on public.templates;
create policy templates_select_member
on public.templates
for select
using (public.is_org_member(org_id));

drop policy if exists templates_write_owner_admin on public.templates;
create policy templates_write_owner_admin
on public.templates
for all
using (public.has_org_role(org_id, array['owner','admin']::public.member_role[]))
with check (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

-- clients: org members can read; owner/admin can write
drop policy if exists clients_select_member on public.clients;
create policy clients_select_member
on public.clients
for select
using (public.is_org_member(org_id));

drop policy if exists clients_write_owner_admin on public.clients;
create policy clients_write_owner_admin
on public.clients
for all
using (public.has_org_role(org_id, array['owner','admin']::public.member_role[]))
with check (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

-- onboardings: org members can read; owner/admin can write
drop policy if exists onboardings_select_member on public.onboardings;
create policy onboardings_select_member
on public.onboardings
for select
using (public.is_org_member(org_id));

drop policy if exists onboardings_write_owner_admin on public.onboardings;
create policy onboardings_write_owner_admin
on public.onboardings
for all
using (public.has_org_role(org_id, array['owner','admin']::public.member_role[]))
with check (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

-- onboarding_versions: org members read; owner/admin write
drop policy if exists onboarding_versions_select_member on public.onboarding_versions;
create policy onboarding_versions_select_member
on public.onboarding_versions
for select
using (public.is_org_member(org_id));

drop policy if exists onboarding_versions_write_owner_admin on public.onboarding_versions;
create policy onboarding_versions_write_owner_admin
on public.onboarding_versions
for all
using (public.has_org_role(org_id, array['owner','admin']::public.member_role[]))
with check (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

-- requirements: org members read; owner/admin write
drop policy if exists onboarding_requirements_select_member on public.onboarding_requirements;
create policy onboarding_requirements_select_member
on public.onboarding_requirements
for select
using (public.is_org_member(org_id));

drop policy if exists onboarding_requirements_write_owner_admin on public.onboarding_requirements;
create policy onboarding_requirements_write_owner_admin
on public.onboarding_requirements
for all
using (public.has_org_role(org_id, array['owner','admin']::public.member_role[]))
with check (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

-- followup_jobs: org members read; owner/admin write
drop policy if exists followup_jobs_select_member on public.followup_jobs;
create policy followup_jobs_select_member
on public.followup_jobs
for select
using (public.is_org_member(org_id));

drop policy if exists followup_jobs_write_owner_admin on public.followup_jobs;
create policy followup_jobs_write_owner_admin
on public.followup_jobs
for all
using (public.has_org_role(org_id, array['owner','admin']::public.member_role[]))
with check (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

-- audit_logs: org members can read; only server writes typically, but allow owner/admin insert for app actions
drop policy if exists audit_logs_select_member on public.audit_logs;
create policy audit_logs_select_member
on public.audit_logs
for select
using (public.is_org_member(org_id));

drop policy if exists audit_logs_insert_owner_admin on public.audit_logs;
create policy audit_logs_insert_owner_admin
on public.audit_logs
for insert
with check (public.has_org_role(org_id, array['owner','admin']::public.member_role[]));

commit;