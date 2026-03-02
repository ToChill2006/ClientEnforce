import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signupAction } from "./action";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const error = sp?.error ? decodeURIComponent(sp.error) : null;

  return (
    <main className="min-h-[calc(100vh-0px)] bg-gradient-to-b from-white to-zinc-50">
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-16">
        {/* Brand */}
        <div className="mb-6 flex w-full items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-xs font-semibold">
            CE
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">ClientEnforce</div>
            <div className="text-xs text-zinc-500">Create your workspace</div>
          </div>
        </div>

        <Card className="w-full shadow-sm">
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>Start using ClientEnforce in under a minute.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <form action={signupAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" name="fullName" placeholder="Jane Doe" required autoComplete="name" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <span className="text-xs text-zinc-600">Min 8 characters</span>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                />
              </div>

              <Button type="submit" className="mt-1">
                Create account
              </Button>

              <div className="text-xs text-zinc-600">
                By continuing, you agree to your organization’s acceptable use policies.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className="h-px flex-1 bg-zinc-200" />
                <div className="text-xs text-zinc-500">or</div>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              <Link
                href="/login"
                className="inline-flex h-10 w-full items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50"
              >
                Log in instead
              </Link>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-xs text-zinc-500">
          Need help? <Link className="underline" href="/login">Contact your admin</Link>.
        </div>
      </div>
    </main>
  );
}