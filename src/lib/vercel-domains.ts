const API = "https://api.vercel.com";

function headers() {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) throw new Error("VERCEL_API_TOKEN is not set");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

function teamParam() {
  const teamId = process.env.VERCEL_TEAM_ID;
  return teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";
}

function projectId() {
  const id = process.env.VERCEL_PROJECT_ID;
  if (!id) throw new Error("VERCEL_PROJECT_ID is not set");
  return id;
}

export async function addDomainToVercel(domain: string) {
  const res = await fetch(`${API}/v10/projects/${projectId()}/domains${teamParam()}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name: domain }),
  });
  const data = await res.json().catch(() => null);
  // 409 means domain already exists on this project — treat as success
  if (!res.ok && res.status !== 409) {
    throw new Error(data?.error?.message ?? `Vercel API error ${res.status}`);
  }
  return data;
}

export async function removeDomainFromVercel(domain: string) {
  const res = await fetch(
    `${API}/v10/projects/${projectId()}/domains/${encodeURIComponent(domain)}${teamParam()}`,
    { method: "DELETE", headers: headers() }
  );
  // 404 means already gone — that's fine
  if (!res.ok && res.status !== 404) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error?.message ?? `Vercel API error ${res.status}`);
  }
}

export type VercelDomainStatus = {
  verified: boolean;
  // The CNAME/A record the user needs to point at
  cname: string | null;
  // Vercel's verification token if domain needs TXT verification
  verificationRecord: { type: string; domain: string; value: string } | null;
};

export async function getDomainStatus(domain: string): Promise<VercelDomainStatus> {
  const res = await fetch(
    `${API}/v10/projects/${projectId()}/domains/${encodeURIComponent(domain)}${teamParam()}`,
    { headers: headers() }
  );
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error?.message ?? `Vercel API error ${res.status}`);

  const verified: boolean = data?.verified === true;
  const cname = "cname.vercel-dns.com";

  // Vercel returns a `verification` array with records to add when domain isn't verified
  const verificationArr: any[] = Array.isArray(data?.verification) ? data.verification : [];
  const txtRecord = verificationArr.find((v: any) => v.type === "TXT");
  const verificationRecord = txtRecord
    ? { type: "TXT", domain: txtRecord.domain, value: txtRecord.value }
    : null;

  return { verified, cname, verificationRecord };
}
