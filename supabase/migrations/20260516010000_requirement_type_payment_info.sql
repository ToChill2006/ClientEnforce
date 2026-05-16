-- Add payment and info to the requirement_type enum.
ALTER TYPE public.requirement_type ADD VALUE IF NOT EXISTS 'payment';
ALTER TYPE public.requirement_type ADD VALUE IF NOT EXISTS 'info';
