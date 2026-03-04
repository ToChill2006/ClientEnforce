"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";

type Row = {
  id: string;
  title: string;
  status: string;
  client_token: string;
  created_at: string;
  template?: { name?: string | null } | null;
  client: { email: string; full_name: string | null };
};

export function OnboardingTable({ rows, appUrl, onSent }: { rows: Row[]; appUrl: string; onSent: () => void }) {
  const toastApi = useToast() as any;
  const toast: (t: any) => void =
    typeof toastApi?.notify === "function"
      ? toastApi.notify
      : typeof toastApi?.push === "function"
      ? toastApi.push
      : () => {};

  async function copyLink(link: string) {
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: "Copied", description: "Client link copied to clipboard.", variant: "success" });
    } catch {
      // Fallback for older/locked-down browsers
      try {
        const ta = document.createElement("textarea");
        ta.value = link;
        ta.setAttribute("readonly", "true");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        toast({ title: "Copied", description: "Client link copied to clipboard.", variant: "success" });
      } catch {
        toast({ title: "Copy failed", description: "Could not copy link. Please copy manually.", variant: "error" });
      }
    }
  }

  const ids = rows.map((r) => r.id);
  const { data: progress } = useOnboardingProgress(ids);

  async function send(onboarding_id: string) {
    try {
      const res = await fetch("/api/onboardings/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ onboarding_id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to send");

      toast({ title: "Sent to client", description: json.link, variant: "success" });
      onSent();
    } catch (e: any) {
      toast({ title: "Send failed", description: e?.message ?? "Unknown error", variant: "error" });
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold">Onboardings</div>
      <div className="divide-y divide-zinc-200">
        {/* Desktop/table headers */}
        <div className="hidden grid-cols-12 gap-3 px-4 py-2 text-xs font-medium text-zinc-500 md:grid">
          <div className="col-span-3">Title</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2">Template</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Progress</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {rows.length === 0 ? (
          <div className="px-4 py-6 text-sm text-zinc-600">No onboardings yet.</div>
        ) : (
          rows.map((r) => {
            const p = progress[r.id]?.percent ?? 0;
            const link = `${appUrl}/c/${r.client_token}`;
            const clientLabel = r.client.full_name ?? r.client.email;
            const templateLabel = r.template?.name ?? "—";

            return (
              <div key={r.id} className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-12 md:items-center">
                {/* Title */}
                <div className="md:col-span-3">
                  <div className="text-sm font-semibold text-zinc-900 truncate max-w-[220px]">{r.title}</div>
                  <div className="mt-0.5 text-xs text-zinc-500 md:hidden">Client: {clientLabel}</div>
                </div>

                {/* Client */}
                <div className="md:col-span-3">
                  <div className="text-sm text-zinc-900">{clientLabel}</div>
                  <div className="mt-1 text-xs text-zinc-500 md:hidden">Template: {templateLabel}</div>
                </div>

                {/* Template */}
                <div className="md:col-span-2">
                  <div className="text-sm text-zinc-900">{templateLabel}</div>
                </div>

                {/* Status */}
                <div className="md:col-span-1">
                  <div className="text-sm text-zinc-900">{r.status}</div>
                </div>

                {/* Progress */}
                <div className="md:col-span-2">
                  <div className="mb-1 flex items-center justify-between text-xs text-zinc-600">
                    <span className="md:hidden">Progress</span>
                    <span className="font-medium text-zinc-900">{p}%</span>
                  </div>
                  <Progress value={p} />
                  <div className="mt-2 break-all text-xs text-zinc-600 md:hidden">
                    Client link:{" "}
                    <a className="underline" href={link} target="_blank" rel="noreferrer">
                      {link}
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 md:col-span-1 md:justify-end">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => (window.location.href = `/dashboard/onboardings/${r.id}`)}
                  >
                    View
                  </Button>
                  <Button variant="secondary" type="button" onClick={() => copyLink(link)}>
                    Copy link
                  </Button>
                  <Button type="button" onClick={() => send(r.id)}>
                    Send
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}