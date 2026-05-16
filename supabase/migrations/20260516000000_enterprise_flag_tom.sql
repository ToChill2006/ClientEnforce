-- Enable enterprise_onboarding feature flag for the org owned by tom.chillman@protonmail.com only.
-- All other orgs remain unaffected.
update public.organizations
set feature_flags = feature_flags || '{"enterprise_onboarding": true}'::jsonb
where id in (
  select org_id
  from public.profiles
  where email = 'tom.chillman@protonmail.com'
);
