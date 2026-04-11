-- Add SMTP email provider configuration columns to organizations.
-- All nullable — NULL email_provider means "use ClientEnforce default (Resend)".

alter table public.organizations
  add column if not exists email_provider  text check (email_provider in ('clientenforce', 'smtp')),
  add column if not exists smtp_host       text,
  add column if not exists smtp_port       integer check (smtp_port between 1 and 65535),
  add column if not exists smtp_secure     boolean,
  add column if not exists smtp_username   text,
  add column if not exists smtp_password   text,
  add column if not exists smtp_from_email text,
  add column if not exists smtp_from_name  text;
