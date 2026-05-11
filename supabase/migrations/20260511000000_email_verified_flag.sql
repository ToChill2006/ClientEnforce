-- Add email verification tracking columns to profiles
alter table public.profiles
  add column if not exists email_verified boolean not null default false,
  add column if not exists email_verification_sent_at timestamptz;

-- Backfill: mark existing confirmed users as verified
update public.profiles p
set email_verified = true
from auth.users u
where u.id = p.user_id
  and u.email_confirmed_at is not null;
