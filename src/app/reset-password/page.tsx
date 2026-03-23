import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction } from "./action";
import { buildNoindexMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNoindexMetadata({
  title: "Reset Password | ClientEnforce",
  description: "Set a new ClientEnforce password to continue managing client onboarding workflows securely.",
  path: "/reset-password",
});

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
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

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
      <div className="mx-auto flex max-w-md flex-col px-6 py-16">
        <Link href="/" className="mb-8 flex w-fit items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white">
            <Image src="/C.png" alt="ClientEnforce logo" width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
          <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>ClientEnforce</span>
        </Link>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <h1 className="mb-4 text-lg font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Reset password
          </h1>

          <div className="flex flex-col gap-4">
            {error ? (
              <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
              Choose a new password for your account.
            </p>

            <form action={resetPasswordAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98]"
              >
                Update password
              </button>
            </form>

            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
            >
              Back to log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
