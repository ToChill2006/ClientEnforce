-- Extend member_role enum with the granular roles used by the app.
-- invites.role and memberships.role both use this type.
-- PostgreSQL only allows ADD VALUE (irreversible), which is fine here.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'onboarder'
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'member_role')
  ) THEN
    ALTER TYPE public.member_role ADD VALUE 'onboarder';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'reviewer'
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'member_role')
  ) THEN
    ALTER TYPE public.member_role ADD VALUE 'reviewer';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'external_viewer'
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'member_role')
  ) THEN
    ALTER TYPE public.member_role ADD VALUE 'external_viewer';
  END IF;
END$$;
