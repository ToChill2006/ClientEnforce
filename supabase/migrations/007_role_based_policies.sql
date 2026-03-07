begin;

-- =========================================================
-- ROLE-BASED RLS POLICIES
-- owner / admin / member
-- =========================================================

-- ---------------------------------------------------------
-- ONBOARDINGS
-- members: select, insert, update
-- admins/owners: delete
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.onboardings') is not null then
    execute 'alter table public.onboardings enable row level security';

    execute 'drop policy if exists "onboardings_select" on public.onboardings';
    execute 'drop policy if exists "onboardings_insert" on public.onboardings';
    execute 'drop policy if exists "onboardings_update" on public.onboardings';
    execute 'drop policy if exists "onboardings_delete_admin" on public.onboardings';

    execute $sql$
      create policy "onboardings_select"
      on public.onboardings
      for select
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = onboardings.org_id
            and m.user_id = auth.uid()
        )
      )
    $sql$;

    execute $sql$
      create policy "onboardings_insert"
      on public.onboardings
      for insert
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = onboardings.org_id
            and m.user_id = auth.uid()
        )
      )
    $sql$;

    execute $sql$
      create policy "onboardings_update"
      on public.onboardings
      for update
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = onboardings.org_id
            and m.user_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = onboardings.org_id
            and m.user_id = auth.uid()
        )
      )
    $sql$;

    execute $sql$
      create policy "onboardings_delete_admin"
      on public.onboardings
      for delete
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = onboardings.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;
  end if;
end $$;

-- ---------------------------------------------------------
-- TEMPLATES
-- members: select
-- admins/owners: insert, update, delete
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.templates') is not null then
    execute 'alter table public.templates enable row level security';

    execute 'drop policy if exists "templates_select" on public.templates';
    execute 'drop policy if exists "templates_insert_admin" on public.templates';
    execute 'drop policy if exists "templates_update_admin" on public.templates';
    execute 'drop policy if exists "templates_delete_admin" on public.templates';

    execute $sql$
      create policy "templates_select"
      on public.templates
      for select
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = templates.org_id
            and m.user_id = auth.uid()
        )
      )
    $sql$;

    execute $sql$
      create policy "templates_insert_admin"
      on public.templates
      for insert
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = templates.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;

    execute $sql$
      create policy "templates_update_admin"
      on public.templates
      for update
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = templates.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = templates.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;

    execute $sql$
      create policy "templates_delete_admin"
      on public.templates
      for delete
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = templates.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;
  end if;
end $$;

-- ---------------------------------------------------------
-- CLIENTS
-- members: select, insert, update
-- admins/owners: delete
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.clients') is not null then
    execute 'alter table public.clients enable row level security';

    execute 'drop policy if exists "clients_select" on public.clients';
    execute 'drop policy if exists "clients_insert" on public.clients';
    execute 'drop policy if exists "clients_update" on public.clients';
    execute 'drop policy if exists "clients_delete_admin" on public.clients';

    execute $sql$
      create policy "clients_select"
      on public.clients
      for select
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = clients.org_id
            and m.user_id = auth.uid()
        )
      )
    $sql$;

    execute $sql$
      create policy "clients_insert"
      on public.clients
      for insert
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = clients.org_id
            and m.user_id = auth.uid()
        )
      )
    $sql$;

    execute $sql$
      create policy "clients_update"
      on public.clients
      for update
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = clients.org_id
            and m.user_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = clients.org_id
            and m.user_id = auth.uid()
        )
      )
    $sql$;

    execute $sql$
      create policy "clients_delete_admin"
      on public.clients
      for delete
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = clients.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;
  end if;
end $$;

-- ---------------------------------------------------------
-- FOLLOWUP JOBS
-- members: select
-- admins/owners: insert, update, delete
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.followup_jobs') is not null then
    execute 'alter table public.followup_jobs enable row level security';

    execute 'drop policy if exists "followup_jobs_select" on public.followup_jobs';
    execute 'drop policy if exists "followup_jobs_insert_admin" on public.followup_jobs';
    execute 'drop policy if exists "followup_jobs_update_admin" on public.followup_jobs';
    execute 'drop policy if exists "followup_jobs_delete_admin" on public.followup_jobs';

    execute $sql$
      create policy "followup_jobs_select"
      on public.followup_jobs
      for select
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = followup_jobs.org_id
            and m.user_id = auth.uid()
        )
      )
    $sql$;

    execute $sql$
      create policy "followup_jobs_insert_admin"
      on public.followup_jobs
      for insert
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = followup_jobs.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;

    execute $sql$
      create policy "followup_jobs_update_admin"
      on public.followup_jobs
      for update
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = followup_jobs.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = followup_jobs.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;

    execute $sql$
      create policy "followup_jobs_delete_admin"
      on public.followup_jobs
      for delete
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = followup_jobs.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;
  end if;
end $$;

-- ---------------------------------------------------------
-- AUDIT LOGS
-- admins/owners: select
-- writes should generally happen via service role
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.audit_logs') is not null then
    execute 'alter table public.audit_logs enable row level security';

    execute 'drop policy if exists "audit_logs_select_admin" on public.audit_logs';

    execute $sql$
      create policy "audit_logs_select_admin"
      on public.audit_logs
      for select
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = audit_logs.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;
  end if;
end $$;

-- ---------------------------------------------------------
-- TEAM TASKS
-- members: select, update own assigned tasks
-- admins/owners: insert, update any, delete
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.team_tasks') is not null then
    execute 'alter table public.team_tasks enable row level security';

    execute 'drop policy if exists "team_tasks_select" on public.team_tasks';
    execute 'drop policy if exists "team_tasks_insert_admin" on public.team_tasks';
    execute 'drop policy if exists "team_tasks_update_member_own" on public.team_tasks';
    execute 'drop policy if exists "team_tasks_update_admin" on public.team_tasks';
    execute 'drop policy if exists "team_tasks_delete_admin" on public.team_tasks';

    execute $sql$
      create policy "team_tasks_select"
      on public.team_tasks
      for select
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = team_tasks.org_id
            and m.user_id = auth.uid()
        )
      )
    $sql$;

    execute $sql$
      create policy "team_tasks_insert_admin"
      on public.team_tasks
      for insert
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = team_tasks.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;

    execute $sql$
      create policy "team_tasks_update_member_own"
      on public.team_tasks
      for update
      using (
        assigned_to = auth.uid()
        and exists (
          select 1
          from public.memberships m
          where m.org_id = team_tasks.org_id
            and m.user_id = auth.uid()
        )
      )
      with check (
        assigned_to = auth.uid()
        and exists (
          select 1
          from public.memberships m
          where m.org_id = team_tasks.org_id
            and m.user_id = auth.uid()
        )
      )
    $sql$;

    execute $sql$
      create policy "team_tasks_update_admin"
      on public.team_tasks
      for update
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = team_tasks.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = team_tasks.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;

    execute $sql$
      create policy "team_tasks_delete_admin"
      on public.team_tasks
      for delete
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = team_tasks.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;
  end if;
end $$;

-- ---------------------------------------------------------
-- TEAM MEMBERSHIPS
-- members: select team roster
-- admins/owners: insert, update, delete
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.memberships') is not null then
    execute 'alter table public.memberships enable row level security';

    execute 'drop policy if exists "memberships_select" on public.memberships';
    execute 'drop policy if exists "memberships_insert_admin" on public.memberships';
    execute 'drop policy if exists "memberships_update_admin" on public.memberships';
    execute 'drop policy if exists "memberships_delete_admin" on public.memberships';

    execute $sql$
      create policy "memberships_select"
      on public.memberships
      for select
      using (
        exists (
          select 1
          from public.memberships self_m
          where self_m.org_id = memberships.org_id
            and self_m.user_id = auth.uid()
        )
      )
    $sql$;

    execute $sql$
      create policy "memberships_insert_admin"
      on public.memberships
      for insert
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = memberships.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;

    execute $sql$
      create policy "memberships_update_admin"
      on public.memberships
      for update
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = memberships.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = memberships.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;

    execute $sql$
      create policy "memberships_delete_admin"
      on public.memberships
      for delete
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = memberships.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;
  end if;
end $$;

-- ---------------------------------------------------------
-- INVITES
-- admins/owners: select, insert, update, delete
-- accept flow should use service role / secure route logic
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.invites') is not null then
    execute 'alter table public.invites enable row level security';

    execute 'drop policy if exists "invites_select_admin" on public.invites';
    execute 'drop policy if exists "invites_insert_admin" on public.invites';
    execute 'drop policy if exists "invites_update_admin" on public.invites';
    execute 'drop policy if exists "invites_delete_admin" on public.invites';

    execute $sql$
      create policy "invites_select_admin"
      on public.invites
      for select
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = invites.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;

    execute $sql$
      create policy "invites_insert_admin"
      on public.invites
      for insert
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = invites.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;

    execute $sql$
      create policy "invites_update_admin"
      on public.invites
      for update
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = invites.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = invites.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;

    execute $sql$
      create policy "invites_delete_admin"
      on public.invites
      for delete
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = invites.org_id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;
  end if;
end $$;

-- ---------------------------------------------------------
-- ORGANIZATIONS
-- members: select own org
-- admins/owners: update own org
-- note: this allows admins to update any exposed org columns
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.organizations') is not null then
    execute 'alter table public.organizations enable row level security';

    execute 'drop policy if exists "organizations_select" on public.organizations';
    execute 'drop policy if exists "organizations_update_admin" on public.organizations';

    execute $sql$
      create policy "organizations_select"
      on public.organizations
      for select
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = organizations.id
            and m.user_id = auth.uid()
        )
      )
    $sql$;

    execute $sql$
      create policy "organizations_update_admin"
      on public.organizations
      for update
      using (
        exists (
          select 1
          from public.memberships m
          where m.org_id = organizations.id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
      with check (
        exists (
          select 1
          from public.memberships m
          where m.org_id = organizations.id
            and m.user_id = auth.uid()
            and m.role in ('owner', 'admin')
        )
      )
    $sql$;
  end if;
end $$;

commit;