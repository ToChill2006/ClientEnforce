-- Store company_name per onboarding so each deal can have its own company name,
-- independent of the shared company_name on the client record.
ALTER TABLE onboardings ADD COLUMN IF NOT EXISTS company_name text;
