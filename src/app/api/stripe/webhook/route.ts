import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

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

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

function tierToSeatsLimit(tier: string | null | undefined) {
  const t = (tier ?? "free").toLowerCase();
  if (t === "business") return 25;
  if (t === "pro") return 5;
  return 1;
}

async function updateOrg(orgId: string, patch: Record<string, any>) {
  const { data, error } = await supabaseAdmin
    .from("organizations")
    .update(patch)
    .eq("id", orgId)
    .select("id, tier, seats_limit, stripe_customer_id, stripe_subscription_id, stripe_subscription_status")
    .single();

  if (error) throw error;
  if (!data?.id) {
    throw new Error(`org update matched 0 rows for orgId=${orgId}`);
  }

  return data;
}

async function getOrg(orgId: string) {
  const { data, error } = await supabaseAdmin
    .from("organizations")
    .select("id, stripe_subscription_id")
    .eq("id", orgId)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
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
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
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
    // 0) Checkout completion (fallback) — useful if subscription events arrive later.
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const orgId = (session.metadata?.org_id as string) || null;
      const tier = (session.metadata?.tier as string) || null;
      const customerId = asStripeId(session.customer);
      const subscriptionId = asStripeId(session.subscription);

      if (orgId && (customerId || subscriptionId || tier)) {
        const nextTier = (tier ?? "pro").toLowerCase();
        const patch: Record<string, any> = {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
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

      if (!orgId) {
        console.warn("[stripe-webhook] subscription missing org_id metadata", { subId: sub.id, type: event.type });
        return NextResponse.json({ received: true });
      }

      const org = await getOrg(String(orgId));
      const canonicalSubId = org?.stripe_subscription_id ?? null;

      // Ignore events for non-canonical subscriptions (e.g., the previous plan being canceled).
      if (canonicalSubId && canonicalSubId !== sub.id) {
        console.log("[stripe-webhook] ignoring non-canonical subscription event", {
          orgId,
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
        patch.tier = "free";
        patch.seats_limit = tierToSeatsLimit("free");
        patch.stripe_subscription_status = "canceled";
      } else if (status === "active" || status === "trialing") {
        const nextTier = (tier ?? "pro").toLowerCase();
        patch.tier = nextTier;
        patch.seats_limit = tierToSeatsLimit(nextTier);
      }

      await updateOrg(orgId, patch);
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

      if (!subscriptionId) {
        console.warn("[stripe-webhook] invoice missing subscription id", { invoiceId: invoice.id, type: event.type });
        return NextResponse.json({ received: true });
      }

      if (!orgId) {
        console.warn("[stripe-webhook] invoice missing org_id metadata", { invoiceId: invoice.id, type: event.type });
        return NextResponse.json({ received: true });
      }

      const org = await getOrg(String(orgId));
      const canonicalSubId = org?.stripe_subscription_id ?? null;

      if (canonicalSubId && subscriptionId && canonicalSubId !== subscriptionId) {
        console.log("[stripe-webhook] ignoring non-canonical invoice event", {
          orgId,
          canonicalSubId,
          eventSubId: subscriptionId,
          type: event.type,
        });
        return NextResponse.json({ received: true });
      }

      const nextTier = (tier ?? "pro").toLowerCase();

      await updateOrg(String(orgId), {
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_subscription_status: "active",
        tier: nextTier,
        seats_limit: tierToSeatsLimit(nextTier),
      });

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[stripe-webhook] handler failed", { type: event.type, message: err?.message ?? String(err), err });
    // IMPORTANT: return non-2xx so you can see failures in `stripe listen` and Stripe retries in production.
    return NextResponse.json({ error: "webhook handler failed", type: event.type }, { status: 500 });
  }
}