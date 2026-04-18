import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const MAIN_HOSTS = new Set(["clientenforce.com", "www.clientenforce.com", "localhost"]);

function isCustomDomain(hostname: string) {
  if (MAIN_HOSTS.has(hostname)) return false;
  if (hostname.endsWith(".vercel.app")) return false;
  if (hostname.endsWith(".localhost")) return false;
  // dashboard subdomain is internal, not a white-label portal
  if (hostname === "dashboard.clientenforce.com") return false;
  return true;
}

export async function middleware(req: NextRequest) {
  const redirectUrl = req.nextUrl.clone();
  if (redirectUrl.hostname === "www.clientenforce.com") {
    redirectUrl.hostname = "clientenforce.com";
    return NextResponse.redirect(redirectUrl, 301);
  }

  const { pathname } = req.nextUrl;
  const hostname = req.nextUrl.hostname;

  // On a custom domain: only allow /c/[token] paths (the client portal).
  // Redirect everything else to the root of the main app.
  if (isCustomDomain(hostname)) {
    if (pathname === "/" || pathname === "") {
      // Nothing meaningful to show at root on a custom domain
      return new NextResponse("Not found", { status: 404 });
    }
    // Let /c/[token] and API routes pass through — everything else block
    if (!pathname.startsWith("/c/") && !pathname.startsWith("/api/")) {
      return new NextResponse("Not found", { status: 404 });
    }
    return NextResponse.next();
  }

  // Only protect dashboard
  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  const nextPath = `${pathname}${req.nextUrl.search || ""}`;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnon) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("error", "Authentication is temporarily unavailable.");
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  const res = NextResponse.next({
    request: { headers: req.headers },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnon,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ["/:path*"],
};
