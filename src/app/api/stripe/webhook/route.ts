import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Lazy — avoid module-level throw when STRIPE_SECRET_KEY is absent at build time
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });
  }
  return _stripe;
}
const stripe = new Proxy({} as Stripe, {
  get(_: Stripe, prop: string | symbol) {
    const c = getStripe();
    const val = Reflect.get(c, prop, c);
    return typeof val === "function" ? val.bind(c) : val;
  },
});

export const runtime = "nodejs";

function getWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  }
  return secret;
}

function asStripeId(v: any): string | null {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object" && typeof v.id === "string") return v.id;
  return null;
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const anyInv = invoice as any;

  // Some payloads include invoice.subscription but Stripe typings may not
  const direct = anyInv?.subscription;
  if (direct) return asStripeId(direct);

  // Stripe invoice webhooks often include parent.subscription_details.subscription
  const parentSub = anyInv?.parent?.subscription_details?.subscription;
  if (parentSub) return asStripeId(parentSub);

  // Fallback: subscription can exist on a line item's parent details
  const lineSub = anyInv?.lines?.data?.[0]?.parent?.subscription_item_details?.subscription;
  if (lineSub) return asStripeId(lineSub);

  return null;
}

// Lazy — avoids module-level throw when Supabase env vars are absent at build time
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
const supabaseAdmin = new Proxy({} as ReturnType<typeof getSupabaseAdmin>, {
  get(_: any, prop: string | symbol) {
    const c = getSupabaseAdmin();
    const val = Reflect.get(c, prop, c);
    return typeof val === "function" ? val.bind(c) : val;
  },
});

function tierToSeatsLimit(tier: string | null | undefined) {
  const t = (tier ?? "free").toLowerCase();
  if (t === "business") return 25;
  if (t === "pro") return 5;
  return 1;
}

function isMissingColumnError(error: any, column: string) {
  const msg = String(error?.message ?? "").toLowerCase();
  if (!msg) return false;
  return (
    msg.includes(column.toLowerCase()) &&
    (msg.includes("does not exist") || msg.includes("schema cache") || msg.includes("could not find"))
  );
}

function shouldRetryWithoutPendingColumns(error: any) {
  return (
    isMissingColumnError(error, "pending_tier") ||
    isMissingColumnError(error, "pending_interval") ||
    isMissingColumnError(error, "pending_seats_limit")
  );
}

function isNoRowsError(error: any) {
  // PostgREST PGRST116: .single() found 0 rows
  return (
    error?.code === "PGRST116" ||
    String(error?.message ?? "").toLowerCase().includes("0 rows") ||
    String(error?.message ?? "").toLowerCase().includes("no rows")
  );
}

function stripPendingColumns(patch: Record<string, any>) {
  if ("pending_tier" in patch) delete patch.pending_tier;
  if ("pending_interval" in patch) delete patch.pending_interval;
  if ("pending_seats_limit" in patch) delete patch.pending_seats_limit;
}

async function updateOrg(orgId: string, patch: Record<string, any>) {
  const patchToApply = { ...patch };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { data, error } = await supabaseAdmin
      .from("organizations")
      .update(patchToApply)
      .eq("id", orgId)
      .select("id, tier, seats_limit, stripe_customer_id, stripe_subscription_id, stripe_subscription_status")
      .maybeSingle();

    if (!error) {
      if (!data?.id) {
        // Org not found — likely deleted. Log and return null so the caller
        // can acknowledge the event rather than letting Stripe retry forever.
        console.warn("[stripe-webhook] updateOrg matched 0 rows, org may have been deleted", { orgId });
        return null;
      }
      return data;
    }

    if (isNoRowsError(error)) {
      console.warn("[stripe-webhook] updateOrg no-rows error, org may have been deleted", { orgId, code: error?.code });
      return null;
    }

    const canRetry = attempt === 0 && shouldRetryWithoutPendingColumns(error);
    if (canRetry) {
      stripPendingColumns(patchToApply);
      continue;
    }

    throw error;
  }
}

async function getOrg(orgId: string) {
  const primary = await supabaseAdmin
    .from("organizations")
    .select("id, stripe_subscription_id, pending_tier, pending_interval, pending_seats_limit")
    .eq("id", orgId)
    .maybeSingle();

  if (!(primary as any)?.error) {
    return (primary as any).data ?? null;
  }

  const error = (primary as any).error;
  if (shouldRetryWithoutPendingColumns(error)) {
    const fallback = await supabaseAdmin
      .from("organizations")
      .select("id, stripe_subscription_id")
      .eq("id", orgId)
      .maybeSingle();

    if ((fallback as any)?.error) throw (fallback as any).error;
    return (fallback as any).data ?? null;
  }

  throw error;
}

async function findOrgIdByStripeRefs(params: {
  customerId?: string | null;
  subscriptionId?: string | null;
}) {
  if (params.subscriptionId) {
    const { data, error } = await supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("stripe_subscription_id", params.subscriptionId)
      .maybeSingle();

    if (error) throw error;
    if (data?.id) return String(data.id);
  }

  if (params.customerId) {
    const { data, error } = await supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("stripe_customer_id", params.customerId)
      .maybeSingle();

    if (error) throw error;
    if (data?.id) return String(data.id);
  }

  return null;
}

async function cancelOtherSubscriptions(customerId: string, keepSubscriptionId: string) {
  try {
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 100,
    });

    const cancellable = new Set(["active", "trialing", "past_due", "unpaid"]);

    const others = subs.data.filter(
      (s) => s.id !== keepSubscriptionId && cancellable.has(String(s.status))
    );

    for (const s of others) {
      // Ensure it cancels now (not at period end) and avoid leaving a dangling active plan.
      // Stripe will handle proration based on your dashboard settings unless you pass proration_behavior.
      try {
        if (s.cancel_at_period_end) {
          await stripe.subscriptions.update(s.id, { cancel_at_period_end: false });
        }
      } catch {
        // ignore
      }

      await stripe.subscriptions.cancel(s.id);
      console.log("[stripe-webhook] canceled old subscription", { customerId, canceled: s.id, kept: keepSubscriptionId });
    }
  } catch (e: any) {
    console.warn("[stripe-webhook] cancelOtherSubscriptions failed", {
      customerId,
      keepSubscriptionId,
      message: e?.message ?? String(e),
    });
  }
}

export async function POST(req: Request) {
  let secret: string;
  try {
    secret = getWebhookSecret();
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    console.error("stripe signature verify failed:", err?.message ?? err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("[stripe-webhook] received", event.type, event.id);

  try {
    // 0) Checkout completion — handles both subscription billing and exhibitor payments.
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // ── Payment requirement checkout ──────────────────────────────────────
      const requirementId = session.metadata?.requirement_id as string | undefined;
      if (requirementId) {
        // Claim idempotency slot FIRST — unique constraint on event id prevents concurrent processing.
        // If another instance already claimed it, the insert returns a conflict and we bail.
        const { error: claimErr } = await supabaseAdmin
          .from("processed_webhook_events")
          .insert({ id: event.id, processed_at: new Date().toISOString() });

        if (claimErr) {
          // Duplicate key = already processed (or concurrent duplicate — either way, skip)
          if (claimErr.code === "23505" || String(claimErr.message).includes("duplicate") || String(claimErr.message).includes("unique")) {
            console.log("[stripe-webhook] already processed payment event", event.id);
          } else {
            console.error("[stripe-webhook] idempotency claim failed", claimErr.message);
          }
          return NextResponse.json({ received: true });
        }

        const paymentIntentId = asStripeId(session.payment_intent);

        const { error: updErr } = await supabaseAdmin
          .from("onboarding_requirements")
          .update({
            payment_status: "paid",
            payment_paid_at: new Date().toISOString(),
            payment_stripe_payment_intent_id: paymentIntentId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", requirementId);

        if (updErr) {
          console.error("[stripe-webhook] failed to mark requirement as paid", updErr.message);
        } else {
          console.log("[stripe-webhook] marked requirement as paid", requirementId);

          // Log to team_activity if the table exists
          try {
            const onboardingId = session.metadata?.onboarding_id as string | undefined;
            const orgId = session.metadata?.org_id as string | undefined;
            if (onboardingId && orgId) {
              await supabaseAdmin.from("team_activity").insert({
                org_id: orgId,
                onboarding_id: onboardingId,
                action: "payment_received",
                details: { requirement_id: requirementId, payment_intent_id: paymentIntentId },
                created_at: new Date().toISOString(),
              });
            }
          } catch {
            // team_activity is optional
          }
        }

        return NextResponse.json({ received: true });
      }

      // ── Subscription billing checkout ─────────────────────────────────────
      const orgIdFromMetadata = (session.metadata?.org_id as string) || null;
      const tier = (session.metadata?.tier as string) || null;
      const customerId = asStripeId(session.customer);
      const subscriptionId = asStripeId(session.subscription);
      const orgId = orgIdFromMetadata || (await findOrgIdByStripeRefs({ customerId, subscriptionId }));

      if (orgId && (customerId || subscriptionId || tier)) {
        const nextTier = (tier ?? "pro").toLowerCase();
        const patch: Record<string, any> = {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          pending_tier: null,
          pending_interval: null,
          pending_seats_limit: null,
        };

        // Only set tier when we are sure this was a subscription checkout.
        // If subscriptionId is present, this is definitely a subscription checkout.
        if (subscriptionId) {
          patch.stripe_subscription_status = "active";
          patch.tier = nextTier;
          patch.seats_limit = tierToSeatsLimit(nextTier);
        }

        await updateOrg(String(orgId), patch);

        // If this checkout created a new subscription, cancel any previous active subscriptions.
        if (customerId && subscriptionId) {
          await cancelOtherSubscriptions(customerId, subscriptionId);
        }
      }

      return NextResponse.json({ received: true });
    }

    // 0a) Checkout session expired — revert pending payment to not_paid
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const requirementId = session.metadata?.requirement_id as string | undefined;

      if (requirementId) {
        await supabaseAdmin
          .from("onboarding_requirements")
          .update({ payment_status: "not_paid", updated_at: new Date().toISOString() })
          .eq("id", requirementId)
          .eq("payment_status", "pending");

        console.log("[stripe-webhook] reverted expired checkout for requirement", requirementId);
      }

      return NextResponse.json({ received: true });
    }

    // 0b) Payment intent failed — mark requirement as failed
    if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const piId = pi.id;

      if (piId) {
        await supabaseAdmin
          .from("onboarding_requirements")
          .update({ payment_status: "failed", updated_at: new Date().toISOString() })
          .eq("payment_stripe_payment_intent_id", piId);

        console.log("[stripe-webhook] marked payment as failed for PI", piId);
      }

      return NextResponse.json({ received: true });
    }

    // 1) Subscription events (good for lifecycle)
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object as Stripe.Subscription;

      const orgId = (sub.metadata?.org_id as string) || null;
      const tier = (sub.metadata?.tier as string) || null;
      const customerId = asStripeId(sub.customer);
      const resolvedOrgId = orgId || (await findOrgIdByStripeRefs({ customerId, subscriptionId: sub.id }));

      if (!resolvedOrgId) {
        console.warn("[stripe-webhook] subscription missing org_id metadata and no org match", {
          subId: sub.id,
          type: event.type,
          customerId,
        });
        return NextResponse.json({ received: true });
      }

      const org = await getOrg(String(resolvedOrgId));
      const canonicalSubId = org?.stripe_subscription_id ?? null;

      // Ignore events for non-canonical subscriptions (e.g., the previous plan being canceled).
      if (canonicalSubId && canonicalSubId !== sub.id) {
        console.log("[stripe-webhook] ignoring non-canonical subscription event", {
          orgId: resolvedOrgId,
          canonicalSubId,
          eventSubId: sub.id,
          type: event.type,
          status: sub.status,
        });
        return NextResponse.json({ received: true });
      }

      const status = String(sub.status ?? "none");

      const patch: Record<string, any> = {
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
        stripe_subscription_status: status,
      };

      if (event.type === "customer.subscription.deleted") {
        const pendingTier = String((org as any)?.pending_tier ?? "").trim().toLowerCase();
        const pendingSeatsLimitRaw = (org as any)?.pending_seats_limit;
        const pendingSeatsLimit =
          typeof pendingSeatsLimitRaw === "number"
            ? pendingSeatsLimitRaw
            : Number.isFinite(Number(pendingSeatsLimitRaw))
              ? Number(pendingSeatsLimitRaw)
              : null;

        if (pendingTier === "pro" || pendingTier === "free" || pendingTier === "business") {
          patch.tier = pendingTier;
          patch.seats_limit = pendingSeatsLimit ?? tierToSeatsLimit(pendingTier);
        } else {
          patch.tier = "free";
          patch.seats_limit = tierToSeatsLimit("free");
        }

        patch.stripe_subscription_status = "canceled";
        patch.pending_tier = null;
        patch.pending_interval = null;
        patch.pending_seats_limit = null;
        patch.stripe_subscription_id = null;
      } else if (status === "active" || status === "trialing") {
        const nextTier = (tier ?? "pro").toLowerCase();
        patch.tier = nextTier;
        patch.seats_limit = tierToSeatsLimit(nextTier);
      }

      await updateOrg(String(resolvedOrgId), patch);
      return NextResponse.json({ received: true });
    }

    // 2) Invoice paid (best signal that payment actually succeeded)
    if (event.type === "invoice.payment_succeeded" || event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;

      // Stripe copies subscription metadata onto invoice lines in your event dump.
      const orgId =
        (invoice.parent as any)?.subscription_details?.metadata?.org_id ||
        invoice.lines?.data?.[0]?.metadata?.org_id ||
        null;

      const tier =
        (invoice.parent as any)?.subscription_details?.metadata?.tier ||
        invoice.lines?.data?.[0]?.metadata?.tier ||
        null;

      const customerId = asStripeId((invoice as any).customer);
      const subscriptionId = getInvoiceSubscriptionId(invoice);
      const resolvedOrgId =
        orgId || (await findOrgIdByStripeRefs({ customerId, subscriptionId }));

      if (!subscriptionId) {
        console.warn("[stripe-webhook] invoice missing subscription id", { invoiceId: invoice.id, type: event.type });
        return NextResponse.json({ received: true });
      }

      if (!resolvedOrgId) {
        console.warn("[stripe-webhook] invoice missing org_id metadata and no org match", {
          invoiceId: invoice.id,
          type: event.type,
          customerId,
          subscriptionId,
        });
        return NextResponse.json({ received: true });
      }

      const org = await getOrg(String(resolvedOrgId));
      const canonicalSubId = org?.stripe_subscription_id ?? null;

      if (canonicalSubId && subscriptionId && canonicalSubId !== subscriptionId) {
        console.log("[stripe-webhook] ignoring non-canonical invoice event", {
          orgId: resolvedOrgId,
          canonicalSubId,
          eventSubId: subscriptionId,
          type: event.type,
        });
        return NextResponse.json({ received: true });
      }

      const nextTier = (tier ?? "pro").toLowerCase();

      await updateOrg(String(resolvedOrgId), {
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_subscription_status: "active",
        tier: nextTier,
        seats_limit: tierToSeatsLimit(nextTier),
        pending_tier: null,
        pending_interval: null,
        pending_seats_limit: null,
      });

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    // Org-not-found is a permanent condition — acknowledge so Stripe stops retrying.
    if (isNoRowsError(err)) {
      console.warn("[stripe-webhook] org not found, acknowledging to stop retries", { type: event.type, message: err?.message });
      return NextResponse.json({ received: true });
    }
    console.error("[stripe-webhook] handler failed", { type: event.type, message: err?.message ?? String(err), err });
    // IMPORTANT: return non-2xx so Stripe retries transient failures (DB down, etc.)
    return NextResponse.json({ error: "webhook handler failed", type: event.type }, { status: 500 });
  }
}
