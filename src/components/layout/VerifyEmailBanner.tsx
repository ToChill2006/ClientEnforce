"use client";

import * as React from "react";
import { X, Mail } from "lucide-react";
import { sendVerificationEmail } from "@/app/dashboard/actions/send-verification-email";

const DISMISS_KEY = "verify-email-banner-dismissed";

export default function VerifyEmailBanner({ emailVerified }: { emailVerified: boolean }) {
  const [visible, setVisible] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (emailVerified) {
      setVisible(false);
      return;
    }
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (!dismissed) setVisible(true);
  }, [emailVerified]);

  if (!visible) return null;

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  async function handleSend() {
    setSending(true);
    setErrorMsg(null);
    const result = await sendVerificationEmail();
    setSending(false);
    if (result.error) {
      setErrorMsg(result.error);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200 mb-5">
      <Mail className="h-4 w-4 shrink-0 opacity-70" />
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
        {sent ? (
          <span>Verification email sent — check your inbox.</span>
        ) : (
          <>
            <span>Verify your email address to keep your account secure.</span>
            {errorMsg && <span className="text-red-600 dark:text-red-400">{errorMsg}</span>}
            <button
              onClick={handleSend}
              disabled={sending}
              className="font-semibold underline underline-offset-2 hover:opacity-70 disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send verification email"}
            </button>
          </>
        )}
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
