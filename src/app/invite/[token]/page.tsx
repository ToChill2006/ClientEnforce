"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const messageTone = useMemo(() => {
    if (!msg) return null;
    const text = msg.toLowerCase();
    if (text.includes("accepted") || text.includes("redirecting")) return "success";
    if (text.includes("please sign in") || text.includes("create an account")) return "info";
    return "error";
  }, [msg]);

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
    } catch (error) {
      setLoading(false);
      setMsg(error instanceof Error ? error.message : "Failed to accept invite");
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
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        acceptInvite();
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [token, sb, acceptInvite]);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex max-w-md flex-col px-6 py-14">
        <Link href="/" className="mb-6 flex w-fit items-center gap-3 rounded-md">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <Image src="/C.png" alt="ClientEnforce logo" width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
          <div className="text-sm font-semibold">ClientEnforce</div>
        </Link>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="mb-2">Accept invite</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <p className="text-sm leading-6 text-zinc-600">
              {checking
                ? "Checking your invite…"
                : "Sign in (or create an account) to accept this invite to your team."}
            </p>

            {loading ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                Accepting invite…
              </div>
            ) : null}

            {msg ? (
              <div
                className={
                  "rounded-lg border p-3 text-sm " +
                  (messageTone === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : messageTone === "info"
                      ? "border-blue-200 bg-blue-50 text-blue-900"
                      : "border-red-200 bg-red-50 text-red-800")
                }
              >
                {msg}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                type="button"
                onClick={() => router.push(loginHref)}
                disabled={loading || checking}
                className="w-full"
              >
                Sign in
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(signupHref)}
                disabled={loading || checking}
                className="w-full"
              >
                Create account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
