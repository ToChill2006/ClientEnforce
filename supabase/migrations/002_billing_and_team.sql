begin;

create extension if not exists pgcrypto;

-- Ensure enums exist
do $$
begin
  if not exists (select 1 from pg_type where typname = 'subscription_tier') then
    create type public.subscription_tier as enum ('free', 'pro', 'business');
  end if;

  if not exists (select 1 from pg_type where typname = 'subscription_status') then
    create type public.subscription_status as enum ('none', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired');
  end if;
end$$;

-- If enums already exist, add missing values (this must NOT be followed by using the values in same txn)
do $$
begin
  -- subscription_tier
  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'subscription_tier' and e.enumlabel = 'free'
  ) then
    alter type public.subscription_tier add value 'free';
  end if;

  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'subscription_tier' and e.enumlabel = 'pro'
  ) then
    alter type public.subscription_tier add value 'pro';
  end if;

  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'subscription_tier' and e.enumlabel = 'business'
  ) then
    alter type public.subscription_tier add value 'business';
  end if;

  -- subscription_status
  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'subscription_status' and e.enumlabel = 'none'
  ) then
    alter type public.subscription_status add value 'none';
  end if;

  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'subscription_status' and e.enumlabel = 'trialing'
  ) then
    alter type public.subscription_status add value 'trialing';
  end if;

  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'subscription_status' and e.enumlabel = 'active'
  ) then
    alter type public.subscription_status add value 'active';
  end if;

  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'subscription_status' and e.enumlabel = 'past_due'
  ) then
    alter type public.subscription_status add value 'past_due';
  end if;

  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'subscription_status' and e.enumlabel = 'canceled'
  ) then
    alter type public.subscription_status add value 'canceled';
  end if;

  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'subscription_status' and e.enumlabel = 'unpaid'
  ) then
    alter type public.subscription_status add value 'unpaid';
  end if;

  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'subscription_status' and e.enumlabel = 'incomplete'
  ) then
    alter type public.subscription_status add value 'incomplete';
  end if;

  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'subscription_status' and e.enumlabel = 'incomplete_expired'
  ) then
    alter type public.subscription_status add value 'incomplete_expired';
  end if;
end$$;

commit;