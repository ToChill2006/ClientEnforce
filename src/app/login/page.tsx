import Link from "next/link";
import { loginAction } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; created?: string }>;
}) {
  const sp = await searchParams;
  const error = sp?.error ? decodeURIComponent(sp.error) : null;
  const created = sp?.created === "1";

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex max-w-md flex-col px-6 py-14">
        <div className="mb-6 flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold">
            CE
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">ClientEnforce</div>
            <div className="text-xs text-zinc-500">Sign in to your workspace</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Log in</CardTitle>
            <CardDescription>Access your dashboard and manage client onboarding.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {created ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                Account created. Please log in.
              </div>
            ) : null}

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <form action={loginAction} className="flex flex-col gap-4">
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
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200" />
              <div className="text-xs text-zinc-500">or</div>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <Link href="/signup" className="w-full">
              <Button type="button" variant="secondary" className="w-full">
                Create an account
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="mt-6 text-xs text-zinc-500">
          By continuing, you agree to your organization’s acceptable use policies.
        </div>
      </div>
    </main>
  );
}