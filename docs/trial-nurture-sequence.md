# ClientEnforce — 7-Email Trial Nurture Sequence

**Trigger:** User signs up for free Solo plan  
**Goal:** Product activation → upgrade to Team plan (£29/month)  
**Duration:** 14 days, 7 emails  
**Tone:** Founder-to-early-user. Warm, direct, no fluff.

---

## Global Exit Rules

Stop the sequence immediately if **any** of the following occur:

- User upgrades to Team plan
- User unsubscribes
- User has sent 5+ active onboardings (Solo limit hit — switch to upgrade-focused flow)
- User has not opened any email by Day 7 (move to re-engagement or suppress)

---

## Email 1 — Day 0 (Welcome + Activate)

**Trigger:** Immediately on signup

**Subject line (A):** You're in — here's where to start  
**Subject line (B):** Welcome to ClientEnforce. One thing to do today.

**Preview text:** Build your first onboarding template in under 20 minutes and send your first portal link.

---

**Body:**

Hey [First Name],

Welcome to ClientEnforce.

The fastest way to see what this actually does is to build one template for your most common client type.

It takes under 20 minutes. Here's the short version:

1. Go to Templates → New Template
2. Add the steps your clients need to complete (documents, signatures, forms)
3. Send the portal link to one real client

That's it. No training. No onboarding call needed.

Once a client receives their portal link, they'll see exactly what they need to submit — and they can't skip required steps.

Build your first template now:
→ https://app.clientenforce.com/templates

Any questions, just reply to this email. I read every one.

— Thomas
Founder, ClientEnforce

---

**Primary CTA:** Build your first template → https://app.clientenforce.com/templates

**Sending conditions:**
- Send immediately on signup
- Skip if user has already created a template before email sends

---

## Email 2 — Day 1 (Setup Nudge)

**Trigger:** 24 hours after signup

**Subject line (A):** 3 things to do in your first 20 minutes  
**Subject line (B):** Did you get your first template set up?

**Preview text:** Most teams are fully set up within one session. Here's what to focus on first.

---

**Body:**

Hey [First Name],

If you haven't set up your first template yet, here's what takes the most time to figure out — so you don't have to:

**1. Start with one template, not three.**
Pick your most common client type. You can always duplicate it later.

**2. Required vs optional steps.**
If a client must submit something before kickoff, mark it required. They won't be able to skip it.

**3. The portal link doesn't need a client login.**
Clients click the link and see their checklist. No account creation. No friction.

That covers the main setup. Most teams send their first real portal link on day one.

→ https://app.clientenforce.com/templates

— Thomas

---

**Primary CTA:** Open your templates → https://app.clientenforce.com/templates

**Sending conditions:**
- Skip if user has already created at least one template
- Skip if user has already sent at least one onboarding

---

## Email 3 — Day 3 (Use Case Education — Accounting / AML)

**Trigger:** 3 days after signup

**Subject line (A):** How accounting firms use ClientEnforce for AML intake  
**Subject line (B):** The AML onboarding problem most firms have (and how to fix it)

**Preview text:** If you're collecting ID, source of funds, or signed engagement letters — this is how to do it properly.

---

**Body:**

Hey [First Name],

If you're in accounting or professional services, this one's for you.

AML compliance requires you to collect specific documents before work begins — proof of identity, source of funds, signed declarations. Most firms are still doing this over email.

The problem: email has no enforcement. A client says they'll send the ID scan. Three weeks pass. You've already started the engagement.

How ClientEnforce handles it:

- Each required document is a step the client must complete before the portal shows as done
- Reminders fire automatically when steps are overdue — you don't chase manually
- Every submission is timestamped — you have an audit trail if you need it
- Clients upload directly to the portal — nothing gets lost in email threads

One template for your standard AML intake. Every new client goes through the same enforced process.

Set yours up here:
→ https://app.clientenforce.com/templates

— Thomas

P.S. If you're an agency or consultant rather than an accounting firm, reply and I'll send you the agency-specific setup guide instead.

---

**Primary CTA:** Set up your AML intake template → https://app.clientenforce.com/templates

**Sending conditions:**
- Send to all users on Day 3
- A/B test subject lines across full list
- Skip if user has already sent 3+ onboardings (they're activated — move to upgrade focus)

---

## Email 4 — Day 5 (Value Realisation — Milestone + Upgrade Tease)

**Trigger:** 5 days after signup

**Subject line (A):** Have you sent your first portal link yet?  
**Subject line (B):** What happens when a client actually completes their onboarding

**Preview text:** The first time a client completes every step without a single chase email is a good feeling.

---

**Body:**

Hey [First Name],

If you've sent your first portal link by now — good. Watch what happens.

You'll get a notification when a step is completed. Then another. Then, if the client is moving through it properly, you'll see the progress bar hit 100% without a single follow-up email from you.

That's the thing we hear most: "I forgot I even sent it."

If you haven't sent your first link yet, now's a good time. Takes two minutes once the template's built.

One thing worth knowing as you get a feel for the product: the Solo plan gives you 1 template and 5 active onboardings. For most people that's enough to test with.

If you're onboarding more than a handful of clients, or you want automated reminders to run without you setting them per onboarding, Team plan handles that — 10 templates, 50 onboardings, automated reminder rules, audit trail export.

More on that later. For now — send the link.

→ https://app.clientenforce.com/onboardings

— Thomas

---

**Primary CTA:** Send your first portal link → https://app.clientenforce.com/onboardings

**Sending conditions:**
- If user has already sent 4+ onboardings: swap body to focus on upgrade, skip the milestone encouragement
- Skip if user has already upgraded

---

## Email 5 — Day 7 (Upgrade Prompt — Solo Limits)

**Trigger:** 7 days after signup

**Subject line (A):** You're getting close to your Solo limit  
**Subject line (B):** What Team plan unlocks (and why most teams switch by week two)

**Preview text:** 5 active onboardings goes fast. Here's what's waiting on the other side.

---

**Body:**

Hey [First Name],

Solo plan gives you 5 active onboardings. If you've been using ClientEnforce this week, you might be getting close.

Here's what Team plan adds for £29/month:

- **50 active onboardings** (10x more)
- **10 templates** — one per service line or client type
- **5 admin seats** — your whole team, not just you
- **Automated reminder rules** — set once, fire on any overdue step
- **Audit trail export** — PDF export of every submission, timestamp, and action

The automated reminders alone are worth it for most teams. On Solo, you can send reminders manually. On Team, you set a rule — "remind every 48 hours if overdue" — and it handles every client automatically.

Upgrade here (cancel anytime):
→ https://clientenforce.com/pricing

If you're not close to the limit yet and Solo is fine for now, no pressure. This will be here when you need it.

— Thomas

---

**Primary CTA:** Upgrade to Team — £29/month → https://clientenforce.com/pricing

**Sending conditions:**
- Prioritise send to users with 3+ active onboardings
- Skip if user has already upgraded
- If user has 0 onboardings sent: swap subject to "What Team plan unlocks" variant and soften the limit framing

---

## Email 6 — Day 10 (Social Proof + Upgrade Nudge)

**Trigger:** 10 days after signup

**Subject line (A):** What teams are saying after their first month  
**Subject line (B):** "I forgot I used to chase clients for this"

**Preview text:** Real feedback from agencies and accounting firms using ClientEnforce. A couple of things might sound familiar.

---

**Body:**

Hey [First Name],

A few things we hear regularly from teams who've been using ClientEnforce for a month or more:

---

*"We onboarded three clients last week and I didn't send a single chase email. The reminders handled it."*
— Marketing agency, 12-person team

*"Our AML intake used to take two weeks of back-and-forth. It's now done before the first call."*
— Accounting firm, 4 partners

*"I set up one template on a Monday afternoon. By Friday, two clients had completed full onboarding without me doing anything."*
— Independent consultant

---

The common thread: the first time onboarding runs itself, it changes how you think about the process.

If you're still on Solo and want the automated reminders and multi-template setup, Team is £29/month.

→ https://clientenforce.com/pricing

And if you're using Solo and it's working fine for your current volume — good. That's exactly what it's there for.

— Thomas

---

**Primary CTA:** Upgrade to Team → https://clientenforce.com/pricing

**Sending conditions:**
- Skip if user has already upgraded
- If user has 0 activity (no templates, no onboardings): send a re-engagement version instead — "Is anything blocked? Reply and I'll help."

---

## Email 7 — Day 14 (Final Nudge — Discount / Extended Trial Offer)

**Trigger:** 14 days after signup

**Subject line (A):** Your Solo trial ends today — here's an offer  
**Subject line (B):** Last email — one thing before you go

**Preview text:** If you're not ready to upgrade, fair enough. But here's what's waiting if you are.

---

**Body:**

Hey [First Name],

Two weeks in.

If you've used ClientEnforce and found it useful, the logical next step is Team — automated reminders, 10 templates, 50 onboardings, full audit trail.

If you upgrade this week, use the code **EARLYTEAM** at checkout for 20% off your first 3 months. That brings Team to £23.20/month.

→ https://clientenforce.com/pricing

If you're not ready to upgrade, you'll stay on the Solo plan — 1 template, 5 active onboardings, no expiry.

A couple of honest things to know about Solo long-term:
- No automated reminders (you'll need to chase manually)
- Limited to 1 template (fine if you have one client type)
- No audit trail export (matters for compliance-heavy work)

If any of those are a problem for you right now, Team solves them.

Either way — glad you tried it. Reply if you have feedback. I'm still reading these.

— Thomas
Founder, ClientEnforce

---

**Primary CTA:** Upgrade with 20% off → https://clientenforce.com/pricing  
*(Discount code: EARLYTEAM — 20% off first 3 months)*

**Sending conditions:**
- Skip if user has already upgraded
- If discount codes are not available in your platform: replace offer with "extended trial" framing — "Reply to this email and I'll extend your access for another 7 days"
- This is the final email in the sequence regardless of user state (except already-upgraded)

---

## Sequence Summary

| # | Day | Goal | Subject (A) | CTA |
|---|-----|------|-------------|-----|
| 1 | 0 | Activate | You're in — here's where to start | Build first template |
| 2 | 1 | Setup nudge | 3 things to do in your first 20 minutes | Open templates |
| 3 | 3 | Education (AML) | How accounting firms use ClientEnforce for AML intake | Set up AML template |
| 4 | 5 | Value realisation | Have you sent your first portal link yet? | Send portal link |
| 5 | 7 | Upgrade prompt | You're getting close to your Solo limit | Upgrade to Team |
| 6 | 10 | Social proof | What teams are saying after their first month | Upgrade to Team |
| 7 | 14 | Final nudge | Your Solo trial ends today — here's an offer | Upgrade with 20% off |

---

## Platform Setup Notes

**Tags / segments to configure:**
- `has_created_template` — set when user creates first template
- `has_sent_onboarding` — set when user sends first portal link
- `onboarding_count` — integer, updated on each new onboarding
- `upgraded` — set when user upgrades to Team; triggers sequence exit

**Recommended tool:** ActiveCampaign, Brevo, or any platform supporting condition-based automations and contact field triggers.

**Discount code:** `EARLYTEAM` — configure in your billing/Stripe setup before activating Email 7.
