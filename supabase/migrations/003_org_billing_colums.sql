begin;

create extension if not exists pgcrypto;

-- Organizations billing fields
alter table public.organizations
  add column if not exists tier public.subscription_tier,
  add column if not exists seats_limit integer,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists stripe_price_id text,
  add column if not exists stripe_subscription_status public.subscription_status,
  add column if not exists current_period_end timestamptz;

-- Backfill any NULLs before setting NOT NULL + defaults
update public.organizations
set
  tier = coalesce(tier, 'free'::public.subscription_tier),
  seats_limit = coalesce(seats_limit, 1),
  stripe_subscription_status = coalesce(stripe_subscription_status, 'none'::public.subscription_status);

-- Defaults + constraints
alter table public.organizations
  alter column tier set default 'free'::public.subscription_tier,
  alter column tier set not null,
  alter column seats_limit set default 1,
  alter column seats_limit set not null,
  alter column stripe_subscription_status set default 'none'::public.subscription_status,
  alter column stripe_subscription_status set not null;

create index if not exists organizations_stripe_customer_id_idx on public.organizations (stripe_customer_id);

-- Invites fields (idempotent)
alter table public.invites
  add column if not exists token uuid not null default gen_random_uuid(),
  add column if not exists role text not null default 'member',
  add column if not exists expires_at timestamptz not null default (now() + interval '7 days'),
  add column if not exists accepted_at timestamptz,
  add column if not exists accepted_by_user_id uuid;

create unique index if not exists invites_token_unique on public.invites (token);
create index if not exists invites_org_id_idx on public.invites (org_id);

commit;