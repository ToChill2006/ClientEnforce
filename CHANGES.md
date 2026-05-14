# Changes

## 2026-05-14 — Enterprise onboarding for DreamHack demo (Thursday 21 May 2026)

Implemented a full enterprise onboarding system gated behind a `feature_flags.enterprise_onboarding` JSONB flag on the `organizations` table. When enabled, exhibitor onboardings are split into sequential phases with dedicated approval, rejection, and submission flows. New routes return 404 (not 403) when the flag is off so other orgs cannot detect the feature exists.

**Schema (migration `20260514000000_dreamhack_events_phases.sql`)**
- Added `feature_flags JSONB` column to `organizations`
- New tables: `events`, `client_types`, `onboarding_phases`, `team_activity`
- Extended `clients`, `onboardings`, `onboarding_requirements` with `client_type_id`, `event_id`, `phase_number`, `review_status`, `reviewer_comment`, `signature_path` columns
- Added `onboarder` and `reviewer` to the `member_role` enum

**Backend APIs**
- `GET/POST /api/events` — list and create events
- `GET/PATCH /api/events/[id]` — event detail and update
- `POST /api/events/[id]/archive` — archive an event
- `POST /api/events/[id]/bulk-import` — CSV-to-exhibitor pipeline with per-row error reporting
- `GET/POST /api/client-types` and `PATCH/DELETE /api/client-types/[id]`
- `GET /api/review-queue` — org-wide phases in `awaiting_review`, sorted by deadline
- `GET /api/team-activity` — human-readable activity feed
- `POST /api/onboardings/[id]/phases/[n]/approve` — approve phase, unlock next, send email
- `POST /api/onboardings/[id]/phases/[n]/reject` — per-item flags + reviewer note, does NOT wipe answers
- `POST /api/onboardings/[id]/phases/[n]/submit` — exhibitor-side submit, validates required items

**Dashboard UI**
- Onboardings page: Solo/Bulk tab bar; Bulk tab shows event cards and links to event detail
- Event detail page: "Exhibitors", "Add Exhibitors" (CSV drop-zone + preview), "Templates" tabs
- Onboarding detail: horizontal phase progress strip + inline review panel with per-item approve/flag controls
- Review Queue page (`/dashboard/review-queue`): all `awaiting_review` phases with deadline urgency badges
- Clients page: "Client Types" tab alongside existing Clients tab
- Team page: "Activity" tab with real-time feed; Onboarder/Reviewer added to role filter
- Email page: Enterprise phase email template editor (phase_approved_next, phase_approved_final, phase_rejected)
- Sidebar: "Review Queue" nav item (ShieldCheck) visible only when flag is on

**Exhibitor portal**
- `/c/[token]` auto-redirects to `/c/[token]/phase/[n]` when enterprise flag is on
- New phase portal at `/c/[token]/phase/[n]`: side nav, status banners, per-item revision highlights, submit + proceed buttons

**Feature infrastructure**
- `src/lib/feature-flags.ts` — `orgHasFeature` / `currentOrgHasFeature` helpers
- `scripts/toggle-feature.ts` — CLI to enable/disable flags per org (`npm run feature -- enable enterprise_onboarding --org "DreamHack"`)
- RBAC: new `onboarder` and `reviewer` roles with scoped permissions in `src/lib/permissions.ts`

**Demo seed**
- `scripts/seed-dreamhack-demo.ts` (`npm run seed:dreamhack`) — creates DreamHack org, 5 client types with 3-phase templates, "DreamHack Dallas 2026" event, 35 exhibitors with varied phase states (awaiting_review, rejected with flags, pre-filled)

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
