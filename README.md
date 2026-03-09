# ClientEnforce

Client onboarding workflow SaaS built with Next.js + Supabase + Stripe + Resend.

## Local setup

1. Install dependencies:
```bash
npm install
```

2. Start development:
```bash
npm run dev
```

3. Build test before shipping:
```bash
npm run build
```

## Production checklist

Set these environment variables in Vercel (Production):

- `NEXT_PUBLIC_APP_URL=https://clientenforce.com`
- `APP_URL=https://clientenforce.com`
- `NEXT_PUBLIC_SUPABASE_URL=...`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- `SUPABASE_SERVICE_ROLE_KEY=...`
- `RESEND_API_KEY=...`
- `RESEND_FROM_EMAIL=...`
- `STRIPE_SECRET_KEY=...`
- `STRIPE_WEBHOOK_SECRET=...`
- `STRIPE_PRICE_PRO_MONTHLY=...`
- `STRIPE_PRICE_PRO_YEARLY=...`
- `STRIPE_PRICE_BUSINESS_MONTHLY=...`
- `STRIPE_PRICE_BUSINESS_YEARLY=...`
- `CRON_SECRET=...`

Supabase Auth settings:

- Site URL: `https://clientenforce.com`
- Redirect URLs:
  - `https://clientenforce.com/auth/callback`
  - `https://clientenforce.com/reset-password`
  - `https://clientenforce.com/invite/*` (if invite flow needs it)

## Notes

- Auth email links are normalized to avoid localhost redirects in production.
- Signup and recovery flows route through `/auth/callback` to reliably finalize session state.
