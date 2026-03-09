"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

function parseOtpType(raw: string | null): EmailOtpType | null {
  const value = String(raw ?? "").trim().toLowerCase();
  if (!value) return null;
  const allowed: EmailOtpType[] = ["signup", "recovery", "invite", "magiclink", "email_change", "email"];
  return allowed.includes(value as EmailOtpType) ? (value as EmailOtpType) : null;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = React.useState("Finishing sign-in…");
  const [errorText, setErrorText] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function completeAuthFlow() {
      const fallbackNext = "/dashboard";
      const next = safeNextPath(searchParams.get("next"), fallbackNext);
      const supabase = supabaseBrowser();

      try {
        const tokenHash = searchParams.get("token_hash");
        const otpType = parseOtpType(searchParams.get("type"));
        const code = searchParams.get("code");
        if (tokenHash && otpType) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: otpType,
          });
          if (error) throw error;
        } else if (code) {
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
        const message = "Authentication link is invalid or expired.";
        if (mounted) {
          setErrorText(message);
          setStatus("Authentication failed. Redirecting to login…");
        }
        window.setTimeout(() => {
          router.replace("/login?error=" + encodeURIComponent(message));
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
      <div className="mx-auto flex max-w-md flex-col px-6 py-14">
        <Link href="/" className="mb-6 flex w-fit items-center gap-3 rounded-md">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <Image src="/C.png" alt="ClientEnforce logo" width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
          <div className="text-sm font-semibold">ClientEnforce</div>
        </Link>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="mb-2">{errorText ? "Authentication failed" : "Authenticating"}</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div
              className={
                "rounded-lg border p-3 text-sm " +
                (errorText
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-blue-200 bg-blue-50 text-blue-900")
              }
            >
              {status}
            </div>

            <p className="text-sm leading-6 text-zinc-600">
              {errorText
                ? "We will take you back to log in in a moment."
                : "Please wait while we verify your link and complete sign-in."}
            </p>

            <Link href="/login" className="w-full">
              <Button type="button" variant="secondary" className="w-full">
                Back to log in
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
