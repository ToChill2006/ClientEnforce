"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

function safeNextPath(raw: string | null, fallback = "/dashboard") {
  if (!raw) return fallback;
  const decoded = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return fallback;
  return decoded;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = React.useState("Finishing sign-in…");

  React.useEffect(() => {
    let mounted = true;

    async function completeAuthFlow() {
      const fallbackNext = "/dashboard";
      const next = safeNextPath(searchParams.get("next"), fallbackNext);
      const supabase = supabaseBrowser();

      try {
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          // For magic-link/hash flows, getSession will process hash tokens when present.
          const { error } = await supabase.auth.getSession();
          if (error) throw error;
        }

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (data?.user) {
          // For verification links we intentionally return users to the login page with a success state.
          if (next.startsWith("/login")) {
            await supabase.auth.signOut();
          }
          router.replace(next);
          return;
        }

        router.replace("/login");
      } catch {
        if (mounted) setStatus("This authentication link is invalid or expired. Redirecting to login…");
        window.setTimeout(() => {
          router.replace("/login?error=" + encodeURIComponent("Authentication link is invalid or expired."));
        }, 600);
      }
    }

    completeAuthFlow();
    return () => {
      mounted = false;
    };
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
        <div className="card-polish w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-zinc-900">{status}</div>
          <div className="mt-2 text-sm text-zinc-600">Please wait a moment.</div>
        </div>
      </div>
    </main>
  );
}
