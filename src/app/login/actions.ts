"use server";

import { createHash, randomInt } from "crypto";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";

function safeNext(raw: string) {
  const n = String(raw || "").trim();
  return n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard";
}

function hashCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

// ── Step 1: verify password, send 6-digit code via Resend ────────────────────
export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = safeNext(String(formData.get("next") || ""));

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email and password are required.")}&next=${encodeURIComponent(next)}`);
  }

  // 1. Verify credentials with Supabase
  const supabase = await supabaseServer();
  const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });

  if (authErr) {
    const msg = /confirm|verif/i.test(authErr.message)
      ? "Please verify your email first."
      : "Incorrect email or password.";
    redirect(`/login?error=${encodeURIComponent(msg)}&next=${encodeURIComponent(next)}`);
  }

  // 2. Sign out immediately — we only needed to verify credentials.
  //    The real session is created after the 6-digit code is confirmed.
  await supabase.auth.signOut();

  // 3. Generate a cryptographically random 6-digit code
  const code = String(randomInt(100000, 999999));
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

  const admin = supabaseAdmin();

  // 4. Invalidate any previous unused codes for this email
  await admin
    .from("login_verifications")
    .update({ used: true })
    .eq("email", email)
    .eq("used", false);

  // 5. Store hashed code
  const { error: dbErr } = await admin.from("login_verifications").insert({
    email,
    code_hash: codeHash,
    expires_at: expiresAt,
  });

  if (dbErr) {
    console.error("[login] failed to store verification code", dbErr.message);
    redirect(`/login?error=${encodeURIComponent("Something went wrong. Please try again.")}&next=${encodeURIComponent(next)}`);
  }

  // 6. Send code via Resend
  try {
    await resend.emails.send({
      from: "ClientEnforce <info@clientenforce.com>",
      to: [email],
      subject: `Your sign-in code: ${code}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2 style="margin-bottom:8px">Your ClientEnforce sign-in code</h2>
          <p style="color:#555;margin-bottom:24px">Enter this code to complete your sign-in. It expires in 10 minutes.</p>
          <div style="background:#f4f4f5;border-radius:8px;padding:24px;text-align:center;letter-spacing:0.3em;font-size:36px;font-weight:700;font-family:monospace">
            ${code}
          </div>
          <p style="color:#888;font-size:13px;margin-top:24px">If you didn't request this, you can ignore this email. Your account is safe.</p>
        </div>
      `,
      text: `Your ClientEnforce sign-in code is: ${code}\n\nIt expires in 10 minutes. If you didn't request this, ignore this email.`,
    });
  } catch (e: any) {
    console.error("[login] resend failed", e?.message);
    redirect(`/login?error=${encodeURIComponent("Failed to send verification email. Please try again.")}&next=${encodeURIComponent(next)}`);
  }

  // 7. Redirect to code entry step
  redirect(
    `/login?step=verify&email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`
  );
}

// ── Step 2: verify code, create session via admin magic link ─────────────────
export async function verifyCodeAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const token = String(formData.get("token") || "").replace(/\s/g, "");
  const next = safeNext(String(formData.get("next") || ""));

  const base = `/login?step=verify&email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`;

  if (!email || token.length !== 6) {
    redirect(`${base}&error=${encodeURIComponent("Please enter the 6-digit code from your email.")}`);
  }

  const admin = supabaseAdmin();

  // 1. Load the most recent unused, unexpired verification for this email
  const { data: verif, error: verifErr } = await admin
    .from("login_verifications")
    .select("id, code_hash, attempts, expires_at")
    .eq("email", email)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (verifErr || !verif) {
    redirect(`${base}&error=${encodeURIComponent("Code expired or not found. Please log in again.")}`);
  }

  // 2. Lock out after 5 wrong attempts
  if (verif.attempts >= 5) {
    await admin.from("login_verifications").update({ used: true }).eq("id", verif.id);
    redirect(`/login?error=${encodeURIComponent("Too many incorrect attempts. Please log in again.")}&next=${encodeURIComponent(next)}`);
  }

  // 3. Verify code hash
  if (hashCode(token) !== verif.code_hash) {
    await admin
      .from("login_verifications")
      .update({ attempts: verif.attempts + 1 })
      .eq("id", verif.id);

    const remaining = 5 - (verif.attempts + 1);
    redirect(
      `${base}&error=${encodeURIComponent(
        remaining > 0 ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` : "Too many incorrect attempts. Please log in again."
      )}`
    );
  }

  // 4. Mark code as used
  await admin.from("login_verifications").update({ used: true }).eq("id", verif.id);

  // 5. Generate a one-time token via admin (does NOT send any email)
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkErr || !linkData?.properties?.hashed_token) {
    console.error("[login] generateLink failed", linkErr?.message);
    redirect(`/login?error=${encodeURIComponent("Sign-in failed. Please try again.")}&next=${encodeURIComponent(next)}`);
  }

  // 6. Verify the token server-side so the session cookie is set on the server
  //    (using supabaseServer gives access to the cookie store — the browser never touches this)
  const supabase = await supabaseServer();
  const { error: sessionErr } = await supabase.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: "magiclink",
  });

  if (sessionErr) {
    console.error("[login] verifyOtp failed", sessionErr.message);
    redirect(`/login?error=${encodeURIComponent("Sign-in failed. Please try again.")}&next=${encodeURIComponent(next)}`);
  }

  // 7. Session cookie is now set — go straight to dashboard
  redirect(next);
}
