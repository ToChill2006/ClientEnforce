# Onboarding — Per-Item Submission Dates & Recent-Activity Highlight

**Date:** 2026-07-08
**Status:** Approved (pending spec review)

## Problem

On the onboarding detail page, progress shows only as a percentage. When a
client fills things in over several days, the bar creeps up (e.g. 48% → 53%)
but there is **no way to see what they actually added**. On a large, multi-day
onboarding Tim can't tell, at a glance, which items were submitted or when.

Each requirement row already renders a `Complete` / `Pending` tag
(`src/app/dashboard/onboardings/[id]/page.tsx`, ~line 1940), but it shows **no
date** and the row isn't visually distinguished. The completion timestamp
(`completed_at`) is **already loaded** on every requirement — it just isn't
displayed.

## Goal

When Tim opens an onboarding, each submitted item clearly shows **what was
submitted and on what date**, and **recently submitted items stand out** so he
can immediately spot what came in on a long onboarding.

## Scope (locked)

- **Front-end only.** A rendering change to the requirement-row component in
  `src/app/dashboard/onboardings/[id]/page.tsx`. No schema, no API, no cron, no
  email, no per-user tracking.
- Recency is derived purely from each item's `completed_at` vs. "now" — not a
  per-user "since you last looked" delta.
- Do **not** touch the Dreamhack Enterprise layer (events / phases /
  feature_flags / business tier). This works on the base requirement model.

## Design

In the requirement-row renderer (the `<li>` returned near line 1900, and the
`payment` branch for consistency):

1. **Submission date.** For a completed item with a `completed_at`, show the
   date next to the existing "Complete" tag, e.g. **"Submitted 8 Jul 2026"**,
   formatted with `toLocaleDateString` (matching the file's existing date
   formatting, e.g. the payment `payPaidAt` display at ~line 1742).
   - If an item is considered complete but has no `completed_at` (legacy rows
     completed via a non-empty value before timestamps were set), show
     "Complete" with no date — do not fabricate one.

2. **Steady highlight for completed rows.** Completed rows get a subtle
   success-tinted treatment (e.g. a left accent border / faint
   `--color-success-subtle` background) so done vs. pending reads instantly.

3. **Recent-activity emphasis.** Items whose `completed_at` is within a recency
   window get a stronger marker — e.g. a small **"New"** badge alongside the
   date — so fresh submissions pop on a long onboarding.
   - Window as a named constant, `RECENT_SUBMISSION_WINDOW_DAYS = 2` (48h).
   - Recency compares `completed_at` to render-time `now`. No storage, no
     per-user state; it naturally "cools off" after the window.

Define small helpers local to the file:
- `isRecent(completedAt)` → boolean against the window.
- reuse/extend the existing date-format pattern for the label.

## Data

No changes. `completed_at` is already selected by
`/api/onboardings/progress?include=requirements` and mapped onto the requirement
objects (`src/app/dashboard/onboardings/[id]/page.tsx`, ~line 119). Payment
items already surface `payment_paid_at`; keep that as-is.

## Error handling / edge cases

- Missing `completed_at` on a completed item → show "Complete", no date, not
  "recent".
- Invalid/unparseable date → fall back to no date rather than throwing.
- Pending items are unchanged (no date, no highlight).

## Testing

- Manual: as a client, complete a few items; confirm each shows "Submitted
  <date>", completed rows are highlighted, and items completed "today" show the
  **New** marker while older completed items do not.
- Verify a legacy completed item without `completed_at` renders "Complete" with
  no date and no crash.
- Confirm pending items look unchanged.

## Explicitly out of scope (future, if wanted)

These were explored and deliberately deferred — the per-item date + recency
highlight covers the core need:

- A full chronological activity **timeline** (would need per-item
  `client_completed_item` audit events; the Activity card exists but under-logs).
- A per-user **"new since you last looked"** delta (would need an
  `onboarding_views` table).
- A **daily digest email** to the team (would need `last_client_activity_at` /
  `last_activity_notified_at` columns + a daily Vercel cron).
