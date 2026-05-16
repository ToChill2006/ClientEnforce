import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ items: [], total: 0 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (!profile?.org_id) return NextResponse.json({ items: [], total: 0 });

    const org_id = profile.org_id;

    // ── 1) Enterprise: phases with status = awaiting_review, scoped to this org ──
    const { data: phases } = await supabase
      .from("onboarding_phases")
      .select("onboarding_id, phase_number, name, updated_at")
      .eq("org_id", org_id)
      .eq("status", "awaiting_review")
      .limit(50);

    const phaseOnboardingIds = Array.from(
      new Set((phases ?? []).map((p: any) => p.onboarding_id).filter(Boolean))
    );

    // ── 2) Non-enterprise: onboardings whose top-level status = awaiting_review ──
    //       Duplicates with step 1 are handled by the allObsById merge below.
    const { data: directReview } = await supabase
      .from("onboardings")
      .select("id, title, client_id, client_full_name, client_email, event_id, updated_at, client_token")
      .eq("org_id", org_id)
      .eq("status", "awaiting_review")
      .limit(50);

    // ── 3) Load onboarding rows for enterprise phase hits ──
    let enterpriseOnboardings: any[] = [];
    if (phaseOnboardingIds.length > 0) {
      const { data: ents } = await supabase
        .from("onboardings")
        .select("id, title, client_id, client_full_name, client_email, event_id, updated_at, client_token")
        .eq("org_id", org_id)
        .in("id", phaseOnboardingIds);
      enterpriseOnboardings = ents ?? [];
    }

    // ── Merge & deduplicate ──
    const allObsById: Record<string, any> = {};
    for (const o of directReview ?? []) allObsById[o.id] = { ...o, via: "direct" };
    for (const o of enterpriseOnboardings) allObsById[o.id] = { ...o, via: "phase" };

    if (Object.keys(allObsById).length === 0) {
      return NextResponse.json({ items: [], total: 0 });
    }

    // ── Enrich: event names ──
    const eventIds = Array.from(
      new Set(Object.values(allObsById).map((o: any) => o.event_id).filter(Boolean))
    );
    const eventNamesById: Record<string, string> = {};
    if (eventIds.length > 0) {
      const { data: events } = await supabase
        .from("events")
        .select("id, name")
        .in("id", eventIds);
      for (const ev of events ?? []) eventNamesById[ev.id] = ev.name;
    }

    // ── Enrich: client names ──
    const clientIds = Array.from(
      new Set(Object.values(allObsById).map((o: any) => o.client_id).filter(Boolean))
    );
    const clientNamesById: Record<string, string> = {};
    if (clientIds.length > 0) {
      const { data: clients } = await supabase
        .from("clients")
        .select("id, full_name, email")
        .in("id", clientIds);
      for (const c of clients ?? []) {
        clientNamesById[c.id] = c.full_name || c.email || "";
      }
    }

    // ── Build phase lookup (first awaiting_review phase per onboarding) ──
    const phaseByOnboardingId: Record<string, any> = {};
    for (const p of phases ?? []) {
      if (!phaseByOnboardingId[(p as any).onboarding_id]) {
        phaseByOnboardingId[(p as any).onboarding_id] = p;
      }
    }

    const items = Object.values(allObsById).map((o: any) => {
      const clientName =
        o.client_full_name || clientNamesById[o.client_id] || o.client_email || "Unknown client";
      const eventName = o.event_id ? (eventNamesById[o.event_id] ?? null) : null;
      const phase = phaseByOnboardingId[o.id] ?? null;
      return {
        onboarding_id: o.id,
        title: o.title ?? clientName,
        client_name: clientName,
        event_name: eventName,
        phase_number: phase?.phase_number ?? null,
        phase_name: phase?.name ?? null,
        token: o.client_token ?? null,
        updated_at: phase?.updated_at ?? o.updated_at ?? null,
      };
    });

    items.sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""));

    return NextResponse.json({ items, total: items.length });
  } catch {
    return NextResponse.json({ items: [], total: 0 });
  }
}
