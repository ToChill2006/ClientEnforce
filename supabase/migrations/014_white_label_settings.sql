-- Add white_label_settings JSONB column to organizations table.
-- Stores brand_name, logo_url, accent_color, portal_tagline,
-- support_email, remove_branding, and custom_domain for Agency Pro orgs.
alter table organizations
  add column if not exists white_label_settings jsonb default null;
