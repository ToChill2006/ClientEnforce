import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, ...(extra ?? {}) }, { status });
}

function nameFromEmail(email?: string | null) {
  const e = (email ?? "").trim();
  if (!e) return null;
  const local = e.split("@")[0] || "";
  if (!local) return null;
  const cleaned = local.replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  return cleaned
    .split(" ")
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
    .join(" ");
}

async function resolveAuthenticatedUser(req: Request, supabase: Awaited<ReturnType<typeof supabaseServer>>) {
  // Normal browser flow: resolve the signed-in user from cookies.
  let { data: userData, error: userErr } = await supabase.auth.getUser();

  // Fallback: support Authorization: Bearer <access_token> for non-cookie clients.
  if (userErr || !userData?.user) {
    const authHeader = req.headers.get("authorization") || "";
    const m = authHeader.match(/^Bearer\s+(.+)$/i);
    if (m?.[1]) {
      ({ data: userData, error: userErr } = await supabase.auth.getUser(m[1]));
    }
  }

  if (userErr || !userData?.user) {
    return {
      user: null,
      error: jsonError(401, "Unauthorized", {
        hint: "Sign in first, then retry. If calling from a client fetch, ensure cookies are sent (credentials: include) or send Authorization: Bearer <access_token>.",
      }),
    };
  }

  return { user: userData.user, error: null };
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token")?.trim();

    if (!token) {
      return jsonError(400, "Missing token");
    }

    const supabase = await supabaseServer();
    const admin = supabaseAdmin();

    const { user, error: authError } = await resolveAuthenticatedUser(req, supabase);
    if (authError || !user) {
      return authError!;
    }
    const userEmail = (user.email ?? "").toLowerCase();

    // Fetch invite
    const { data: invite, error: inviteErr } = await admin
      .from("invites")
      .select("id, org_id, invited_email, role, status, expires_at")
      .eq("token", token)
      .maybeSingle();

    if (inviteErr) {
      return jsonError(500, inviteErr.message);
    }

    if (!invite) {
      return jsonError(404, "Invite not found");
    }

    if (invite.status !== "pending") {
      return jsonError(400, "Invite is not pending", { status: invite.status });
    }

    if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) {
      return jsonError(400, "Invite expired");
    }

    const invitedEmail = (invite.invited_email ?? "").toLowerCase();
    if (invitedEmail && userEmail && invitedEmail !== userEmail) {
      return jsonError(403, "This invite is for a different email", {
        invited_email: invite.invited_email,
        signed_in_as: user.email,
      });
    }

    // Ensure a profile row exists for this user (team page often joins memberships -> profiles)
    const fullNameFromMetaRaw =
      (user.user_metadata as any)?.full_name ||
      (user.user_metadata as any)?.name ||
      (user.user_metadata as any)?.display_name ||
      null;

    const fullNameFromMeta =
      (typeof fullNameFromMetaRaw === "string" && fullNameFromMetaRaw.trim()
        ? fullNameFromMetaRaw.trim()
        : null) || nameFromEmail(user.email) || "Member";

    // Different projects use different schemas:
    //  - profiles(id = auth.users.id, ...)
    //  - profiles(user_id = auth.users.id, ...)
    // We try both so the Team page can show name/email.
    let profileId: string | null = null;

    async function tryUpsertProfile(payload: any, onConflict: string) {
      return await admin
        .from("profiles")
        .upsert(payload, { onConflict } as any)
        .select("id")
        .maybeSingle();
    }

    try {
      // First, ensure the profile exists with the columns we KNOW are present.
      // (Your DB currently has at least: user_id, email, created_at, updated_at)
      const { data: pA, error: eA } = await tryUpsertProfile(
        {
          user_id: user.id,
          email: user.email ?? null,
        },
        "user_id"
      );

      if (!eA && pA?.id) {
        profileId = (pA as any).id ?? null;
      } else {
        const msg = String((eA as any)?.message ?? "").toLowerCase();

        // Fallback schema: profiles(id = auth.users.id, email)
        if (msg.includes("user_id") || msg.includes("column") || msg.includes("does not exist")) {
          const { data: pB, error: eB } = await tryUpsertProfile(
            {
              id: user.id,
              email: user.email ?? null,
            },
            "id"
          );

          if (!eB && pB?.id) profileId = (pB as any).id ?? null;
        }
      }
    } catch {
      // Profiles table/columns may differ between environments; membership creation below will still run.
    }

    // Best-effort: if full_name and/or org_id columns exist, backfill them.
    // (These updates are ignored if the columns are not present.)
    try {
      const patch: any = {};
      if (fullNameFromMeta) patch.full_name = fullNameFromMeta;
      if (invite?.org_id) patch.org_id = invite.org_id;

      if (Object.keys(patch).length) {
        const r1 = await admin.from("profiles").update(patch).eq("user_id", user.id);
        const msg1 = String((r1 as any)?.error?.message ?? "").toLowerCase();

        // Fallback: profiles(id = auth.users.id)
        if ((r1 as any)?.error && (msg1.includes("user_id") || msg1.includes("does not exist") || msg1.includes("column"))) {
          await admin.from("profiles").update(patch).eq("id", user.id);
        }
      }
    } catch {
      // ignore
    }

    // Backfill name/email if profile row exists but fields are empty
    try {
      const { data: existing } = await admin
        .from("profiles")
        .select("id, full_name, email")
        .or(`user_id.eq.${user.id},id.eq.${user.id}`)
        .maybeSingle();

      if (existing?.id) {
        profileId = (existing as any).id ?? profileId;
        const needsName = !(existing as any).full_name || String((existing as any).full_name).trim() === "";
        const needsEmail = !(existing as any).email || String((existing as any).email).trim() === "";
        if (needsName || needsEmail) {
          const patch: any = {};
          if (needsName) patch.full_name = fullNameFromMeta;
          if (needsEmail) patch.email = user.email ?? null;
          // Try both possible key styles
          const r1 = await admin.from("profiles").update(patch).eq("user_id", user.id);
          const msg1 = String((r1 as any)?.error?.message ?? "").toLowerCase();
          if ((r1 as any)?.error && (msg1.includes("user_id") || msg1.includes("does not exist"))) {
            await admin.from("profiles").update(patch).eq("id", user.id);
          }
        }
      }
    } catch {
      // ignore
    }

    // If we still don't know the profile id, try resolving it in both common ways.
    if (!profileId) {
      try {
        const { data: p1 } = await admin.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
        profileId = (p1 as any)?.id ?? null;
      } catch {
        // ignore
      }
    }

    if (!profileId) {
      try {
        const { data: p2 } = await admin.from("profiles").select("id").eq("id", user.id).maybeSingle();
        profileId = (p2 as any)?.id ?? null;
      } catch {
        // ignore
      }
    }

    async function upsertMembership(args: { org_id: string; role: string }) {
      // Try the most common schema first: memberships(org_id, user_id, role)
      const attemptUserId = await admin
        .from("memberships")
        .upsert(
          {
            org_id: args.org_id,
            user_id: user.id,
            role: args.role,
          } as any,
          { onConflict: "org_id,user_id" }
        );

      if (!(attemptUserId as any)?.error) return attemptUserId as any;

      const msg = String((attemptUserId as any)?.error?.message ?? "");

      // Fallback schema: memberships(org_id, profile_id, role)
      if (msg.toLowerCase().includes("user_id") && msg.toLowerCase().includes("does not exist")) {
        if (!profileId) {
          // Try to resolve profile id if the earlier upsert didn't return it.
          try {
            const r1 = await admin.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
            profileId = (r1 as any)?.id ?? (r1 as any)?.data?.id ?? null;
            // note: depending on supabase-js version, maybeSingle returns { data, error }
            if (!profileId && (r1 as any)?.data?.id) profileId = (r1 as any).data.id;
          } catch {
            // ignore
          }
        }

        if (!profileId) {
          try {
            const r2 = await admin.from("profiles").select("id").eq("id", user.id).maybeSingle();
            profileId = (r2 as any)?.id ?? (r2 as any)?.data?.id ?? null;
            if (!profileId && (r2 as any)?.data?.id) profileId = (r2 as any).data.id;
          } catch {
            // ignore
          }
        }
        if (!profileId) {
          return { error: { message: "Could not resolve profile for invited user" } } as any;
        }

        return (await admin
          .from("memberships")
          .upsert(
            {
              org_id: args.org_id,
              profile_id: profileId,
              role: args.role,
            } as any,
            { onConflict: "org_id,profile_id" }
          )) as any;
      }

      // Some schemas use member_user_id
      if (msg.toLowerCase().includes("user_id") && msg.toLowerCase().includes("column")) {
        return (await admin
          .from("memberships")
          .upsert(
            {
              org_id: args.org_id,
              member_user_id: user.id,
              role: args.role,
            } as any,
            { onConflict: "org_id,member_user_id" } as any
          )) as any;
      }

      return attemptUserId as any;
    }

    // Create membership (idempotent). Support multiple possible membership schemas.
    const membershipRes = await upsertMembership({
      org_id: invite.org_id,
      role: invite.role ?? "member",
    });

    const membershipErr = (membershipRes as any)?.error;
    if (membershipErr) {
      return jsonError(500, membershipErr.message || "Failed to create membership");
    }

    // Ensure the invited user profile is linked to the org (some UIs filter profiles by org_id)
    // This is best-effort and should not block accepting the invite if the schema differs.
    try {
      const patchOrg: any = { org_id: invite.org_id };

      // Try profiles(user_id = auth.users.id)
      const r1 = await admin.from("profiles").update(patchOrg).eq("user_id", user.id);
      const msg1 = String((r1 as any)?.error?.message ?? "").toLowerCase();

      // Fallback: profiles(id = auth.users.id)
      if ((r1 as any)?.error && (msg1.includes("user_id") || msg1.includes("does not exist") || msg1.includes("column"))) {
        const r2 = await admin.from("profiles").update(patchOrg).eq("id", user.id);
        const msg2 = String((r2 as any)?.error?.message ?? "").toLowerCase();

        // If org_id column doesn't exist in this environment, ignore.
        if ((r2 as any)?.error && (msg2.includes("org_id") && (msg2.includes("does not exist") || msg2.includes("column")))) {
          // no-op
        }
      }
    } catch {
      // ignore
    }

    // Mark invite accepted (some schemas may not have accepted_by_user_id)
    const acceptedPatch: any = {
      status: "accepted",
      accepted_at: new Date().toISOString(),
      accepted_by_user_id: user.id,
    };

    let updateErr = (await admin.from("invites").update(acceptedPatch).eq("id", invite.id)).error as any;

    if (updateErr) {
      const msg = String(updateErr?.message ?? "").toLowerCase();
      if (msg.includes("accepted_by_user_id") && (msg.includes("does not exist") || msg.includes("column"))) {
        delete acceptedPatch.accepted_by_user_id;
        updateErr = (await admin.from("invites").update(acceptedPatch).eq("id", invite.id)).error as any;
      }
    }

    if (updateErr) return jsonError(500, updateErr.message);

    return NextResponse.json({ ok: true, org_id: invite.org_id });
  } catch (e: any) {
    return jsonError(500, e?.message || "Unexpected error");
  }
}