# ClientEnforce — Implementation Prompt: Two New Features

Use this prompt to build both features in order. Read the full prompt before writing any code. Build Feature 1 completely before starting Feature 2.

---

## Codebase Context

This is a Next.js app with Supabase (Postgres + Storage). The core domain is client onboarding: org users build **templates** containing **requirements** (tasks), then create **onboardings** from those templates. Each onboarding generates individual `onboarding_requirements` rows that clients complete through a token-based portal at `/c/[token]`.

### Key architectural facts

- **Requirement types** are a Postgres enum `requirement_type` with values: `text`, `file`, `signature`.
- **Templates** store their structure as JSONB in `templates.definition`, shaped as `{ requirements: [{ type, label, is_required, sort_order }] }`.
- **Onboarding creation** (in `src/app/api/onboardings/route.ts`, ~line 812–871) reads the template definition and inserts one `onboarding_requirements` row per requirement. It uses defensive column fallbacks — if a column doesn't exist, it strips it and retries.
- **Supabase Storage** uses two private buckets: `clientenforce-uploads` (25MB limit) and `clientenforce-signatures` (5MB limit). Files are referenced in `bucket:path` format.
- **The client portal** (`src/components/client/ClientPortal.tsx`) conditionally renders `TextRequirement`, `FileRequirement`, or `SignatureRequirement` components based on `r.type`.
- **The template builder** (`src/app/dashboard/templates/page.tsx`) uses a native `<select>` dropdown for type, a text input for label, and a checkbox for `is_required`.
- **The dashboard detail page** (`src/app/dashboard/onboardings/[id]/page.tsx`) uses a `valuePreview()` function to determine how to display each requirement's response (text, file link, signature link, or empty dash).
- **Zod schemas** live in `src/lib/onboarding-schema.ts`. The `RequirementTypeSchema` is `z.enum(["text", "file", "signature"])` and `TemplateRequirementSchema` validates each requirement in a template definition.
- **File downloads** go through `/api/storage/download` which validates org-scoped paths and proxies from Supabase Storage using the service role key.
- **Client answers** are saved via `/api/onboardings/client/answer` (sets `value_text`) and `/api/onboardings/client/upload` (sets `file_path`). Both mark `completed_at`.

### Key files you will touch

```
supabase/migrations/                              — new migration files
src/lib/onboarding-schema.ts                      — Zod schemas
src/app/api/templates/route.ts                    — template CRUD
src/app/api/templates/upload/route.ts             — NEW: template attachment upload
src/app/api/onboardings/route.ts                  — onboarding creation (requirement generation)
src/app/api/onboardings/client/answer/route.ts    — client answer endpoint
src/app/api/onboardings/client/upload/route.ts    — client file upload
src/app/api/onboardings/client/download/route.ts  — NEW: client-facing attachment download
src/app/api/onboardings/progress/route.ts         — progress + requirement fetching
src/app/api/storage/download/route.ts             — existing download proxy
src/app/dashboard/templates/page.tsx              — template builder UI
src/app/dashboard/onboardings/[id]/page.tsx       — dashboard onboarding detail
src/app/c/[token]/page.tsx                        — client portal entry page
src/components/client/ClientPortal.tsx             — client portal requirement components
```

---

## Feature 1: Downloadable Form Attachment on Tasks

### What it does

An org user can attach a pre-built form file (PDF, DOCX, etc.) to a `file`-type requirement when building a template. When the client views that task in their portal, they see a "Download form" button to get the template file. They fill it in offline, then upload their completed version using the existing file upload area.

### Step 1: Database migration

Create `supabase/migrations/008_attachment_path.sql`:

```sql
-- Add optional attachment column for org-provided form templates
ALTER TABLE public.onboarding_requirements
  ADD COLUMN IF NOT EXISTS attachment_path TEXT;

-- No RLS changes needed — existing row-level policies on onboarding_requirements apply
```

This single nullable column stores the `bucket:path` reference to the org-uploaded template file. The existing `file_path` column continues to store the client's uploaded response.

### Step 2: Update Zod schemas

In `src/lib/onboarding-schema.ts`:

- Add `attachment_path: z.string().optional()` to `TemplateRequirementSchema`.
- This allows template definitions to carry an attachment reference per requirement.

### Step 3: Template attachment upload API

Create `src/app/api/templates/upload/route.ts`:

- Accept POST with multipart form data: `file` (the attachment file).
- Require authentication and `templates_write` permission.
- Get the user's `org_id` from their membership.
- Ensure the `clientenforce-uploads` bucket exists (same pattern as `src/app/api/onboardings/client/upload/route.ts` — call `admin.storage.createBucket()` wrapped in a try/catch).
- Generate the storage path: `org_{orgId}/templates/{Date.now()}_{sanitizedFilename}`.
- Upload to Supabase Storage using the admin client.
- Return `{ attachment_path: "clientenforce-uploads:org_{orgId}/templates/..." }` as JSON.
- Restrict file size to 25MB (the bucket default) and optionally validate MIME type to common document formats (application/pdf, application/vnd.openxmlformats-officedocument.*, image/png, image/jpeg).

### Step 4: Update the template builder UI

In `src/app/dashboard/templates/page.tsx`:

- When a requirement's type is `"file"`, show an additional row below the label input: a file input and a small label like "Attach a form template (optional)".
- On file selection, POST to `/api/templates/upload` with the file as FormData.
- On success, store the returned `attachment_path` in the requirement object within the local state (the `definition.requirements` array).
- If an attachment already exists, show the filename (parse it from the path the same way `fileNameFromPath()` works in the detail page) with a small "Remove" button that clears the `attachment_path` from state.
- The attachment path persists when the template is saved because it's part of the definition JSONB — no separate database write needed.

### Step 5: Propagate attachment_path during onboarding creation

In `src/app/api/onboardings/route.ts`, in the requirement-generation loop (~line 834):

- Read `attachment_path` from each template requirement: `it.attachment_path ?? null`.
- Include it in the row object passed to the `onboarding_requirements` insert.
- Add a defensive fallback: if the insert fails with a missing-column error for `attachment_path`, strip it and retry (same pattern already used for `requirement_key` at ~line 850).

### Step 6: Include attachment_path in data fetching

In `src/app/api/onboardings/progress/route.ts`:

- Add `attachment_path` to the column list in the Supabase select query (currently at ~line 85–87).
- Use defensive column handling — if the column doesn't exist yet, catch the error and retry without it.

In `src/app/c/[token]/page.tsx`:

- When normalizing requirements (~line where fields are mapped), include `attachment_path` from the raw requirement data and pass it through to the `ClientPortal` component.

### Step 7: Client-facing attachment download route

Create `src/app/api/onboardings/client/download/route.ts`:

The existing `/api/storage/download` requires Supabase auth, but the client portal uses token-based access (no auth session). You need a new route that validates via client token instead.

- Accept GET with query params: `token`, `requirement_id`.
- Look up the onboarding by `client_token`.
- Verify the requirement belongs to that onboarding and has an `attachment_path`.
- Parse the `bucket:path` reference from `attachment_path`.
- Fetch the file from Supabase Storage using the admin client (service role).
- Return the file blob with `Content-Disposition: attachment; filename="..."` header.

### Step 8: Update the client portal UI

In `src/components/client/ClientPortal.tsx`:

- Update the `Requirement` type to include `attachment_path: string | null`.
- Modify the `FileRequirement` component:
  - If `attachment_path` is present and non-empty, render a **"Download form template"** button above the existing file upload area.
  - The button should call `/api/onboardings/client/download?token={token}&requirement_id={id}` and trigger a browser download (create a temporary `<a>` tag, same pattern as `triggerBrowserDownload()` in the dashboard detail page).
  - Style it distinctly from the upload area — maybe a secondary/outline button with a download icon.
  - Keep the existing upload area below it, unchanged.

### Step 9: Update the dashboard detail page

In `src/app/dashboard/onboardings/[id]/page.tsx`:

- When rendering a file-type requirement, check if `attachment_path` is present.
- If so, show a small "Form template" link/button next to or below the requirement label that downloads the attachment via the existing `/api/storage/download` route (this page has auth, so the existing route works).
- This lets org users verify which form was attached.

### Step 10: Testing checklist

- [ ] Org user can upload an attachment when creating a template with a file-type requirement.
- [ ] Attachment filename displays in the template builder after upload.
- [ ] Org user can remove an attachment and re-upload a different one.
- [ ] Creating an onboarding from that template copies `attachment_path` to the requirement row.
- [ ] Client portal shows the "Download form template" button on that requirement.
- [ ] Clicking the download button downloads the correct file.
- [ ] Client can still upload their completed file normally.
- [ ] Dashboard detail page shows both the attachment and the client's uploaded response.
- [ ] Requirements without an attachment still work exactly as before.
- [ ] Locked onboardings still allow downloading the attachment (read-only is fine).

---

## Feature 2: Multiple Choice Field Type on Tasks

### What it does

A new requirement type that lets the org user define a list of options. The client selects one option from the list. The selected answer saves as `value_text` and displays on the dashboard like a text response.

### Step 1: Database migration

Create `supabase/migrations/009_multiple_choice.sql`:

```sql
-- Add multiple_choice to the requirement_type enum
-- NOTE: ALTER TYPE ... ADD VALUE cannot run inside a transaction.
-- Supabase migrations handle this automatically.
ALTER TYPE public.requirement_type ADD VALUE IF NOT EXISTS 'multiple_choice';

-- Add options column for storing the choice list
ALTER TABLE public.onboarding_requirements
  ADD COLUMN IF NOT EXISTS options JSONB;
```

The `options` column stores a JSON array of strings, e.g. `["Option A", "Option B", "Option C"]`. The client's selected answer goes into the existing `value_text` column.

### Step 2: Update Zod schemas

In `src/lib/onboarding-schema.ts`:

- Change `RequirementTypeSchema` to: `z.enum(["text", "file", "signature", "multiple_choice"])`.
- Add `options: z.array(z.string().min(1)).optional()` to `TemplateRequirementSchema`.
- Optionally add a refinement: if `type` is `"multiple_choice"`, `options` must be present with at least 2 items.

### Step 3: Update the template builder UI

In `src/app/dashboard/templates/page.tsx`:

- Add `"multiple_choice"` as a fourth `<option>` in the type `<select>` dropdown. Display text: "Multiple choice".
- When a requirement's type is `"multiple_choice"`, render an **options editor** below the label input:
  - A list of text inputs, one per option, each with a delete (✕) button.
  - An "Add option" button that appends a new empty input.
  - Minimum 2 options enforced (disable delete buttons when only 2 remain).
  - Maximum ~20 options to keep the UI manageable.
  - Options are stored in the requirement object as `options: ["...", "..."]`.
- When the type is changed away from `"multiple_choice"`, clear the `options` array from the requirement.
- Validate on save: if any requirement is `multiple_choice`, it must have at least 2 non-empty options. Show a validation error if not.
- Prevent duplicate option text within the same requirement.

### Step 4: Propagate options during onboarding creation

In `src/app/api/onboardings/route.ts`, in the requirement-generation loop:

- Read `options` from each template requirement: `it.options ?? null`.
- Include it in the row object for the `onboarding_requirements` insert.
- Add defensive fallback: if insert fails with a missing-column error for `options`, strip it and retry.

### Step 5: Include options in data fetching

In `src/app/api/onboardings/progress/route.ts`:

- Add `options` to the column list in the select query.
- Defensive fallback if column doesn't exist.

In `src/app/c/[token]/page.tsx`:

- Include `options` when normalizing requirement data and pass it to `ClientPortal`.

### Step 6: Create the MultipleChoiceRequirement component

In `src/components/client/ClientPortal.tsx`:

- Update the `Requirement` type to include `options: string[] | null`.
- Create a new `MultipleChoiceRequirement` component, following the same patterns as `TextRequirement`:

```
Props: requirement, token, isLocked, onSaved (callback)

Behavior:
- Parse the options array from the requirement.
- If 5 or fewer options: render as radio buttons in a vertical list.
- If more than 5 options: render as a <select> dropdown.
- Pre-select the current value if `value_text` matches one of the options.
- On selection change:
  - Call POST /api/onboardings/client/answer with { token, requirement_id, value_text: selectedOption }.
  - Show saving/saved/error status (same pattern as TextRequirement's debounce status).
  - Call onSaved() to refresh progress.
- Disabled when isLocked is true.
```

- Add the component to the conditional rendering chain in the main requirement list:

```tsx
{r.type === "multiple_choice" ? (
  <MultipleChoiceRequirement ... />
) : null}
```

### Step 7: Optional answer validation

In `src/app/api/onboardings/client/answer/route.ts`:

- After validating the token and requirement, if the requirement type is `"multiple_choice"` and `options` is present:
  - Verify that `value_text` is one of the values in the `options` array.
  - If not, return a 400 error: "Selected value is not a valid option."
- This prevents clients from submitting arbitrary values via API manipulation.
- Fetch the requirement's `options` column alongside the existing query. Handle the column not existing gracefully.

### Step 8: Update the dashboard detail page

In `src/app/dashboard/onboardings/[id]/page.tsx`:

- Add to the `reqKindLabel()` function: `"multiple_choice"` → `"Multiple choice"`.
- The selected answer already displays correctly through `valuePreview()` → text path, since the answer is stored in `value_text`. No rendering changes needed.
- Optionally: in the requirement detail, show the available options as a small comma-separated list below the selected answer, so org users can see what the choices were. This is a nice-to-have, not required.

### Step 9: Testing checklist

- [ ] "Multiple choice" appears in the template builder type dropdown.
- [ ] Selecting it reveals the options editor.
- [ ] Options can be added, edited, and removed (minimum 2 enforced).
- [ ] Template saves successfully with multiple_choice requirements.
- [ ] Creating an onboarding from that template creates a requirement row with `type = 'multiple_choice'` and `options` populated.
- [ ] Client portal renders radio buttons for the multiple choice requirement.
- [ ] Selecting an option auto-saves and shows confirmation.
- [ ] The saved value appears in the dashboard detail page.
- [ ] Progress calculation counts the requirement as completed when an option is selected.
- [ ] Submitting the onboarding works with the multiple choice requirement completed.
- [ ] Existing templates and onboardings with text/file/signature types are unaffected.
- [ ] Invalid option values are rejected by the answer API.

---

## Build Order

1. **Feature 1, Steps 1–10** (attachment on tasks) — lower risk, no enum changes, validates the "add column + propagate" pattern.
2. **Feature 2, Steps 1–9** (multiple choice) — builds on the same pattern, adds the enum value.

Within each feature, follow the step order exactly. Each step depends on the one before it.

---

## General Implementation Notes

- **Defensive column handling.** The codebase already has a pattern for this (see `isMissingColumnError` usage in `onboardings/route.ts`). Use the same pattern for `attachment_path` and `options` — try the insert with the new column, catch column-not-found errors, strip the column, and retry.
- **No breaking changes.** Both features add nullable columns and an optional enum value. Existing data is untouched. Existing API responses gain new fields that are `null` by default.
- **Audit logging.** Add audit events for: `template.attachment_uploaded`, `onboarding.client_attachment_downloaded`. Follow the existing pattern in the upload and signature routes.
- **TypeScript types.** Update any shared TypeScript types or interfaces that mirror the `onboarding_requirements` shape to include the new fields. The dashboard detail page and client portal both have local `Requirement` type definitions that need updating.
- **Error states.** Every new UI interaction (attachment upload, attachment download, option selection) needs loading, success, and error states. Follow the existing toast/banner pattern used throughout the app.
