const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"]);
const CANONICAL_PROD_ORIGIN = "https://clientenforce.com";
const DEV_FALLBACK_ORIGIN = "http://localhost:3000";
const REDIRECT_QUERY_KEYS = ["redirect_to", "redirect_uri", "redirectUrl", "return_to", "next"];

function toOrigin(raw?: string | null): string | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

function isLocalHostname(hostname: string) {
  const host = hostname.toLowerCase();
  return LOCAL_HOSTS.has(host) || host.endsWith(".local");
}

function rewriteLocalAbsoluteUrl(raw: string, targetOrigin: URL) {
  const value = String(raw ?? "").trim();
  if (!value) return value;

  try {
    const parsed = new URL(value);
    if (!isLocalHostname(parsed.hostname)) return parsed.toString();
    return `${targetOrigin.protocol}//${targetOrigin.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return value;
  }
}

export function appOrigin() {
  const vercelEnv = String(process.env.VERCEL_ENV ?? "").toLowerCase();
  const isProductionDeployment = vercelEnv
    ? vercelEnv === "production"
    : process.env.NODE_ENV === "production";

  if (isProductionDeployment) {
    return CANONICAL_PROD_ORIGIN;
  }

  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ];

  for (const candidate of candidates) {
    const origin = toOrigin(candidate);
    if (!origin) continue;
    const hostname = new URL(origin).hostname.toLowerCase();
    if (isLocalHostname(hostname)) continue;
    return origin;
  }

  return DEV_FALLBACK_ORIGIN;
}

export function normalizeAuthEmailLink(rawLink?: string | null) {
  const link = String(rawLink ?? "").trim();
  if (!link) return "";

  try {
    const url = new URL(link);
    const target = new URL(appOrigin());
    const canRewriteToTarget = !isLocalHostname(target.hostname);

    if (canRewriteToTarget) {
      if (isLocalHostname(url.hostname)) {
        url.protocol = target.protocol;
        url.host = target.host;
      }

      for (const key of REDIRECT_QUERY_KEYS) {
        const current = url.searchParams.get(key);
        if (!current) continue;
        const nextValue = rewriteLocalAbsoluteUrl(current, target);
        if (nextValue !== current) {
          url.searchParams.set(key, nextValue);
        }
      }
    }

    return url.toString();
  } catch {
    if (link.startsWith("/")) return `${appOrigin()}${link}`;
    return link;
  }
}

type BuildAuthTokenLinkArgs = {
  tokenHash?: string | null;
  type?: string | null;
  next?: string | null;
};

export function buildAuthTokenLink(args: BuildAuthTokenLinkArgs) {
  const tokenHash = String(args.tokenHash ?? "").trim();
  if (!tokenHash) return "";

  const url = new URL("/auth/callback", appOrigin());
  url.searchParams.set("token_hash", tokenHash);

  const type = String(args.type ?? "").trim();
  if (type) url.searchParams.set("type", type);

  const next = String(args.next ?? "").trim();
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    url.searchParams.set("next", next);
  }

  return url.toString();
}
