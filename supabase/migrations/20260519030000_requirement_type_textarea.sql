-- Add textarea to the requirement_type enum.
ALTER TYPE public.requirement_type ADD VALUE IF NOT EXISTS 'textarea';
