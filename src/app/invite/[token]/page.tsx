"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function InvitePage() {
  const router = useRouter();
  const params = useParams<{ token?: string | string[] }>();

  const token = useMemo(() => {
    const t = params?.token;
    if (Array.isArray(t)) return t[0] ?? "";
    return t ?? "";
  }, [params]);

  const loginHref = useMemo(() => {
    return token ? `/login?next=${encodeURIComponent(`/invite/${token}`)}` : "/login";
  }, [token]);

  const signupHref = useMemo(() => {
    return token ? `/signup?next=${encodeURIComponent(`/invite/${token}`)}` : "/signup";
  }, [token]);

  const sb = useMemo(() => supabaseBrowser(), []);

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const acceptInvite = useCallback(async () => {
    if (!token) {
      setChecking(false);
      setMsg("Invalid invite link.");
      return;
    }

    setChecking(false);
    setLoading(true);
    setMsg(null);

    try {
      // Let the server decide if the user is signed in (it can see cookies).
      const res = await fetch(`/api/team/accept?token=${encodeURIComponent(token)}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      // If not signed in, show CTA (don’t auto-bounce back to /login in a loop)
      if (res.status === 401) {
        setLoading(false);
        setMsg("Please sign in (or create an account) to accept this invite.");
        return;
      }

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLoading(false);
        setMsg(body?.error ?? "Failed to accept invite");
        return;
      }

      setLoading(false);
      setMsg("Invite accepted. Redirecting…");
      router.replace("/dashboard");
    } catch (e: any) {
      setLoading(false);
      setMsg(e?.message ?? "Failed to accept invite");
    }
  }, [token, router]);

  // Try once on page load (works if already logged in)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (cancelled) return;
      if (!token) {
        setChecking(false);
        setMsg("Invalid invite link.");
        return;
      }
      await acceptInvite();
    }

    run();

    // After login/signup redirect back here, auth state changes; try again.
    const { data: sub } = sb.auth.onAuthStateChange((event) => {
      console.log("[invite] auth state changed:", event);
      acceptInvite();
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [token, sb, acceptInvite]);

  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <h1 className="text-xl font-semibold">You’ve been invited</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {checking
          ? "Checking your invite…"
          : "Sign in (or create an account) to accept the invite."}
      </p>

      <div className="mt-6 flex justify-center gap-2">
        <Link className="rounded-md bg-black px-4 py-2 text-white" href={loginHref}>
          Sign in
        </Link>
        <Link className="rounded-md border px-4 py-2" href={signupHref}>
          Create account
        </Link>
      </div>

      {msg && (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">{msg}</p>
        </div>
      )}
    </div>
  );
}