alter table public.templates
add column if not exists deleted_at timestamptz null;