import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { loginAction, verifyCodeAction } from "./actions";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Card, CardContent } from "@/components/ui/card";
import { AuthSubmitButton } from "@/components/auth/submit-button";
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
  searchParams: Promise<{
    error?: string;
    created?: string;
    verified?: string;
    reset?: string;
    message?: string;
    next?: string;
    step?: string;
    email?: string;
  }>;
}) {
  const sp = await searchParams;

  const decode = (v?: string) => { try { return v ? decodeURIComponent(v) : null; } catch { return v ?? null; } };

  const error = decode(sp?.error);
  const message = decode(sp?.message);
  const created = sp?.created === "1";
  const verified = sp?.verified === "1";
  const reset = sp?.reset === "1" || sp?.reset === "success";
  const next = sp?.next && sp.next.startsWith("/") ? sp.next : "/dashboard";

  const step = sp?.step === "verify" ? "verify" : "email";
  const prefillEmail = decode(sp?.email) ?? "";

  const logo = (
    <Link href="/" className="mb-8 mx-auto flex w-fit items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)]">
        <Image src="/C.png" alt="ClientEnforce logo" width={24} height={24} className="h-6 w-6 object-contain" />
      </div>
      <span className="text-sm font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
        ClientEnforce
      </span>
    </Link>
  );

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <LoginToasts verified={verified} reset={reset} />
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-16">
        {logo}

        {step === "verify" ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Check your inbox
              </h1>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                We emailed a 6-digit code to{" "}
                <span className="font-medium text-[var(--color-text-primary)]">{prefillEmail}</span>.
                Enter it below to sign in.
              </p>
            </div>

            <Card className="shadow-[var(--shadow-sm)]">
              <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
                {error ? (
                  <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
                    {error}
                  </div>
                ) : null}

                <form action={verifyCodeAction} className="flex flex-col gap-4">
                  <input type="hidden" name="next" value={next} />
                  <input type="hidden" name="email" value={prefillEmail} />
                  <FormField label="6-digit code" htmlFor="token" required>
                    <Input
                      id="token"
                      name="token"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="000000"
                      maxLength={6}
                      required
                      autoFocus
                      className="text-center tracking-[0.4em]"
                      style={{ fontSize: "22px", letterSpacing: "0.4em" }}
                    />
                  </FormField>
                  <AuthSubmitButton>Verify & sign in</AuthSubmitButton>
                </form>
              </CardContent>
            </Card>

            <p className="mt-5 text-center text-sm text-[var(--color-text-secondary)]">
              Didn&apos;t receive it? Check your spam, or{" "}
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              >
                try again
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Log in to ClientEnforce
              </h1>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                Manage your client onboarding workspace.
              </p>
            </div>

            <Card className="shadow-[var(--shadow-sm)]">
              <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
                {created ? (
                  <div className="rounded-[var(--radius-md)] border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                    Account created — log in to continue.
                  </div>
                ) : null}

                {message ? (
                  <div className="rounded-[var(--radius-md)] border border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] p-3 text-sm text-[var(--color-accent)]">
                    {message}
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
                    {error}
                  </div>
                ) : null}

                <form action={loginAction} className="flex flex-col gap-4">
                  <input type="hidden" name="next" value={next} />
                  <FormField label="Email" htmlFor="email" required>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      autoFocus
                      className="text-base"
                      style={{ fontSize: "16px" }}
                    />
                  </FormField>
                  <FormField
                    label={
                      <div className="flex w-full items-center justify-between gap-3">
                        <span>Password</span>
                        <Link href="/forgot-password" className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                          Forgot password?
                        </Link>
                      </div>
                    }
                    htmlFor="password"
                    required
                  >
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="text-base"
                      style={{ fontSize: "16px" }}
                    />
                  </FormField>
                  <AuthSubmitButton>Log in</AuthSubmitButton>
                </form>
              </CardContent>
            </Card>

            <p className="mt-5 text-center text-sm text-[var(--color-text-secondary)]">
              New to ClientEnforce?{" "}
              <Link
                href={next === "/dashboard" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`}
                className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              >
                Create your account
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
