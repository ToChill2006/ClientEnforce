# Manual test — signup flow (no email gate)

Run after each deploy that touches `src/app/signup/`.

## Steps

1. **Sign up with a new email address**
   - Go to `/signup`
   - Enter a name, a fresh email, and a password ≥ 8 characters
   - Submit the form
   - Expected: redirected directly to `/dashboard?welcome=1` — no "check your email" step

2. **Verify email banner appears**
   - On the dashboard, a yellow banner should read "Verify your email address to keep your account secure."
   - Click "Send verification email" — button changes to "Sending…" then the banner reads "Verification email sent — check your inbox."
   - Clicking the X dismisses the banner for the session (refresh to confirm it comes back; close and reopen the tab to confirm it stays dismissed)

3. **Complete email verification**
   - Open the verification email and click "Verify email address"
   - Expected: redirected to `/dashboard?verified=1`
   - Reload the dashboard — the yellow banner should no longer appear

4. **Duplicate email**
   - Try to sign up with the same email again
   - Expected: an inline error message on `/signup` (e.g. "User already registered")
