import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { loginAction } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <LoginToasts verified={verified} reset={reset} />
      <div className="mx-auto flex max-w-md flex-col px-6 py-14">
        <Link href="/" className="mb-6 flex w-fit items-center gap-3 rounded-md">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <Image src="/C.png" alt="ClientEnforce logo" width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
          <div className="text-sm font-semibold">ClientEnforce</div>
        </Link>

        <section className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Log in to ClientEnforce</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Access your onboarding workspace to review client tasks, collect documents, and keep every
            onboarding workflow on track.
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            New to ClientEnforce?{" "}
            <Link
              href={next === "/dashboard" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`}
              className="font-medium text-zinc-900 underline underline-offset-4"
            >
              Create your ClientEnforce account
            </Link>
            {" "}to get started.
          </p>
        </section>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="mb-2">Log in</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {created ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                Account created. Please log in.
              </div>
            ) : null}

            {message ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <form action={loginAction} className="flex flex-col gap-4">
              <input type="hidden" name="next" value={next} />
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs font-medium text-zinc-600 hover:text-zinc-900">
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

              <Button type="submit">Log in</Button>
              <Link href="/forgot-password" className="w-full">
                <Button type="button" variant="ghost" className="w-full text-sm">
                  Forgot your password?
                </Button>
              </Link>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200" />
              <div className="text-xs text-zinc-500">or</div>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <Link href={`/signup?next=${encodeURIComponent(next)}`} className="w-full">
              <Button type="button" variant="secondary" className="w-full">
                Create an account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
