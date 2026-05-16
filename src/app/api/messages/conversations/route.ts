export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getOrgId } from "@/lib/rbac";

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ conversations: [], total_unread: 0 });

    const org_id = await getOrgId();
    if (!org_id) return NextResponse.json({ conversations: [], total_unread: 0 });

    const admin = supabaseAdmin();

    // All messages for this org, newest first
    const { data: messages } = await admin
      .from("onboarding_messages")
      .select("onboarding_id, sender_type, sender_name, body, created_at")
      .eq("org_id", org_id)
      .order("created_at", { ascending: false });

    if (!messages?.length) return NextResponse.json({ conversations: [], total_unread: 0 });

    const onboardingIds = [...new Set(messages.map((m: any) => m.onboarding_id))];

    // Onboarding details (select * to avoid schema-cache column issues)
    const { data: onboardings } = await admin
      .from("onboardings")
      .select("*")
      .in("id", onboardingIds)
      .eq("org_id", org_id);

    // Client details for linked client rows
    const clientIds = [...new Set((onboardings ?? []).map((o: any) => o.client_id).filter(Boolean))];
    const clientsById: Record<string, any> = {};
    if (clientIds.length > 0) {
      const { data: clients } = await admin
        .from("clients")
        .select("id, full_name, email")
        .in("id", clientIds as string[]);
      for (const c of clients ?? []) clientsById[(c as any).id] = c;
    }

    // Admin read timestamps per onboarding
    const { data: reads } = await admin
      .from("onboarding_chat_reads")
      .select("onboarding_id, last_read_at")
      .in("onboarding_id", onboardingIds as string[])
      .eq("side", "admin");

    const readsByOb: Record<string, string> = {};
    for (const r of reads ?? []) readsByOb[(r as any).onboarding_id] = (r as any).last_read_at;

    // Group messages by onboarding
    const msgsByOb: Record<string, any[]> = {};
    for (const m of messages) {
      if (!msgsByOb[(m as any).onboarding_id]) msgsByOb[(m as any).onboarding_id] = [];
      msgsByOb[(m as any).onboarding_id].push(m);
    }

    const conversations = onboardingIds.map((obId) => {
      const ob = (onboardings ?? []).find((o: any) => o.id === obId) as any;
      const msgs = msgsByOb[obId] ?? [];
      const lastMsg = msgs[0];
      const myLastReadAt = readsByOb[obId] ?? null;

      const cutoff = myLastReadAt ? new Date(myLastReadAt).getTime() : 0;
      const unreadCount = msgs.filter(
        (m: any) => m.sender_type === "client" && new Date(m.created_at).getTime() > cutoff
      ).length;

      const client = ob?.client_id ? clientsById[ob.client_id] : null;
      const clientName = ob?.client_full_name ?? ob?.client_name ?? client?.full_name ?? "Unknown";
      const clientEmail = ob?.client_email ?? client?.email ?? null;

      return {
        onboarding_id: obId as string,
        title: (ob?.title ?? clientName) as string,
        client_name: clientName as string,
        client_email: clientEmail as string | null,
        last_message: lastMsg
          ? { body: lastMsg.body, sender_type: lastMsg.sender_type, sender_name: lastMsg.sender_name, created_at: lastMsg.created_at }
          : null,
        unread_count: unreadCount,
        my_last_read_at: myLastReadAt,
      };
    });

    conversations.sort((a, b) =>
      (b.last_message?.created_at ?? "").localeCompare(a.last_message?.created_at ?? "")
    );

    const total_unread = conversations.reduce((s, c) => s + c.unread_count, 0);

    return NextResponse.json({ conversations, total_unread });
  } catch {
    return NextResponse.json({ conversations: [], total_unread: 0 });
  }
}
