-- Add email template customisation columns to organizations.
-- All nullable — NULL means "use the app default".

alter table public.organizations
  add column if not exists email_subject_template text,
  add column if not exists email_heading           text,
  add column if not exists email_body              text,
  add column if not exists email_cta_label         text;
