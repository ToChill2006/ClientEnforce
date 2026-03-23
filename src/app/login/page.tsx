import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { loginAction } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginToasts from "./toasts";
import { buildNoindexMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNoindexMetadata({
  title: "Login | ClientEnforce",
  description:
    "Log in to ClientEnforce to manage client onboarding workflows, document collection, and onboarding task progress.",
  path: "/login",
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; created?: string; verified?: string; reset?: string; message?: string; next?: string }>;
}) {
  const sp = await searchParams;
  const error = (() => {
    if (!sp?.error) return null;
    try {
      return decodeURIComponent(sp.error);
    } catch {
      return sp.error;
    }
  })();
  const created = sp?.created === "1";
  const verified = sp?.verified === "1";
  const reset = sp?.reset === "1" || sp?.reset === "success";
  const message = (() => {
    if (!sp?.message) return null;
    try {
      return decodeURIComponent(sp.message);
    } catch {
      return sp.message;
    }
  })();
  const next = sp?.next && sp.next.startsWith("/") ? sp.next : "/dashboard";

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
      <LoginToasts verified={verified} reset={reset} />
      <div className="mx-auto flex max-w-md flex-col px-6 py-16">
        <Link href="/" className="mb-8 flex w-fit items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white">
            <Image src="/C.png" alt="ClientEnforce logo" width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            ClientEnforce
          </span>
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Log in to ClientEnforce
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            New to ClientEnforce?{" "}
            <Link
              href={next === "/dashboard" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`}
              className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            >
              Create your account
            </Link>
            {" "}to get started.
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col gap-4">
            {created ? (
              <div className="rounded-[var(--radius-md)] border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                Account created. Please log in.
              </div>
            ) : null}

            {message ? (
              <div className="rounded-[var(--radius-md)] border border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] p-3 text-sm text-[var(--color-accent)]">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <form action={loginAction} className="flex flex-col gap-4">
              <input type="hidden" name="next" value={next} />
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98]"
              >
                Log in
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--color-border)]" />
              <span className="text-xs text-[var(--color-text-muted)]">or</span>
              <div className="h-px flex-1 bg-[var(--color-border)]" />
            </div>

            <Link
              href={`/signup?next=${encodeURIComponent(next)}`}
              className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
