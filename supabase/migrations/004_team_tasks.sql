-- Team Tasks: assignable internal tasks for org members
-- Requires: organizations, profiles, memberships, role enum already exist.

begin;

create table if not exists public.team_tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  assigned_to uuid not null references auth.users(id) on delete cascade,

  title text not null,
  description text,
  status text not null default 'open' check (status in ('open','in_progress','done','archived')),
  due_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_tasks_org_id_idx on public.team_tasks(org_id);
create index if not exists team_tasks_assigned_to_idx on public.team_tasks(assigned_to);
create index if not exists team_tasks_status_idx on public.team_tasks(status);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_team_tasks_updated_at on public.team_tasks;
create trigger trg_team_tasks_updated_at
before update on public.team_tasks
for each row execute function public.set_updated_at();

alter table public.team_tasks enable row level security;

-- Helper: user is a member of the org via memberships
-- (Assumes memberships.user_id references auth.users(id))
create or replace function public.is_org_member(p_org_id uuid, p_user_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.memberships m
    where m.org_id = p_org_id
      and m.user_id = p_user_id
  );
$$;

-- Helper: user is owner/admin in org
create or replace function public.is_org_admin(p_org_id uuid, p_user_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.memberships m
    where m.org_id = p_org_id
      and m.user_id = p_user_id
      and m.role in ('owner','admin')
  );
$$;

-- Policies:
-- Members can read tasks in their org if assigned to them OR they are admin/owner
drop policy if exists team_tasks_select on public.team_tasks;
create policy team_tasks_select
on public.team_tasks
for select
to authenticated
using (
  public.is_org_member(org_id, auth.uid())
  and (
    assigned_to = auth.uid()
    or created_by = auth.uid()
    or public.is_org_admin(org_id, auth.uid())
  )
);

-- Only admin/owner can create tasks (assign to any member)
drop policy if exists team_tasks_insert on public.team_tasks;
create policy team_tasks_insert
on public.team_tasks
for insert
to authenticated
with check (
  public.is_org_admin(org_id, auth.uid())
  and created_by = auth.uid()
  and public.is_org_member(org_id, assigned_to)
);

-- Update rules:
-- Admin/owner can update anything in org
-- Assignee can update status (and updated_at trigger handles timestamp)
drop policy if exists team_tasks_update_admin on public.team_tasks;
create policy team_tasks_update_admin
on public.team_tasks
for update
to authenticated
using (
  public.is_org_admin(org_id, auth.uid())
)
with check (
  public.is_org_admin(org_id, auth.uid())
);

drop policy if exists team_tasks_update_assignee_status on public.team_tasks;
create policy team_tasks_update_assignee_status
on public.team_tasks
for update
to authenticated
using (
  public.is_org_member(org_id, auth.uid())
  and assigned_to = auth.uid()
)
with check (
  public.is_org_member(org_id, auth.uid())
  and assigned_to = auth.uid()
  and status in ('open','in_progress','done','archived')
);

-- Only admin/owner can delete
drop policy if exists team_tasks_delete on public.team_tasks;
create policy team_tasks_delete
on public.team_tasks
for delete
to authenticated
using (
  public.is_org_admin(org_id, auth.uid())
);

commit;