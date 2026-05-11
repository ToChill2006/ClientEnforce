# Changes

## 2026-05-11 — SEO canonicalisation + signup gate removal

### SEO (Workstream A)

**Redirects & canonicalisation**
- Replaced all `next.config.ts` redirects with the May 2026 canonical map (22 permanent redirects)
- Deleted 8 deprecated route folders: `/blog/client-onboarding-checklist-template`, `/blog/honeybook-alternatives`, `/blog/onboarding-for-agencies`, `/client-intake-and-onboarding-software`, `/client-onboarding-process`, `/client-onboarding-tools`, `/onboarding-for-accountants`, `/onboarding-for-consultants`
- Fixed all internal links pointing to 301'd paths across nav, homepage, and blog/landing pages

**Content merges**
- `/client-onboarding-checklist` — absorbed checklist template content (new sections: "What makes a useful checklist template" + detailed sections)
- `/honeybook-alternative` — absorbed `/blog/honeybook-alternatives` competitor comparison table

**Fleet recovery (urgent)**
- `/fleet-account-onboarding` — full rewrite targeting commercial/software intent; clear separation from blog
- `/blog/fleet-account-onboarding` — rewritten as informational 6-step process guide; product pitch moved to single back-half CTA
- `RESUBMIT_TO_GSC.md` created — list of URLs to request indexing after deploy

**FAQ schema**
- Added `JsonLd` + `buildFaqPageSchema` to `UsVerticalPage` component — fixes FAQ schema for all 9 vertical pages (agencies, consultants, accountants, law-firm, financial-advisors, dental-practices, health-wellness, auto-service, ops-teams)

**On-page SEO**
- All edited pages pass title ≤60 chars, description ≤155 chars, single H1 with keyword

**Docs**
- `docs/seo-canonical-map.md` — full keyword→URL canonical map for the team

### Signup gate removal (Workstream B)

- `src/app/signup/action.ts` — replaced `generateLink` + verification email with `createUser({ email_confirm: true })` + immediate `signInWithPassword`; redirects to `/dashboard?welcome=1`
- `supabase/migrations/20260511000000_email_verified_flag.sql` — adds `email_verified` + `email_verification_sent_at` columns to `public.profiles`
- `src/components/layout/VerifyEmailBanner.tsx` — dismissible in-dashboard banner prompting optional email verification (sessionStorage dismiss)
- `src/app/dashboard/actions/send-verification-email.ts` — server action with 60s rate-limit, generates magiclink via admin API, sends via Resend
- `src/app/auth/verify-email/route.ts` — verifies OTP token, sets `email_verified = true`, redirects to `/dashboard?verified=1`
- `src/app/dashboard/layout.tsx` — fetches `email_verified` from profile, renders `VerifyEmailBanner`
- `src/app/signup/page.tsx` — updated subheading: "You'll be signed in straight away. No email confirmation required."
- `docs/manual-test-signup.md` — 4-step smoke check for the new flow
