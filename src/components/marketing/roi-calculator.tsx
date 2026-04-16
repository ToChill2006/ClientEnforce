"use client";

import { useState } from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function RoiCalculator() {
  const [revenuePerAccount, setRevenuePerAccount] = useState(850);
  const [stalledAccounts, setStalledAccounts] = useState(4);

  const revenueAtRisk = revenuePerAccount * stalledAccounts;
  const recoverable = Math.round(revenueAtRisk * 0.8);

  return (
    <section className="border-b border-[var(--color-border)] bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Cost of inaction
          </p>
          <h2
            className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How much does one stalled onboarding cost you?
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
            Every fleet account or commercial client that stalls before their first service call is revenue sitting idle. Use the numbers below to see what your current backlog is actually worth.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text-primary)]">
                  Average first-service revenue per account
                </label>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                  First oil change, tire rotation, or fleet service visit
                </p>
                <div className="relative mt-3">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-semibold text-[var(--color-text-muted)]">$</span>
                  <input
                    type="number"
                    min={50}
                    max={50000}
                    step={50}
                    value={revenuePerAccount}
                    onChange={(e) => setRevenuePerAccount(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white py-3 pl-8 pr-4 text-sm font-semibold text-[var(--color-text-primary)] shadow-[var(--shadow-xs)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  />
                </div>
                <input
                  type="range"
                  min={50}
                  max={10000}
                  step={50}
                  value={revenuePerAccount}
                  onChange={(e) => setRevenuePerAccount(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--color-accent)]"
                />
                <div className="flex justify-between text-[10px] text-[var(--color-text-muted)]">
                  <span>$50</span><span>$10,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-text-primary)]">
                  Fleet or commercial accounts stalled right now
                </label>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                  Accounts waiting on missing paperwork, approvals, or data before first service
                </p>
                <div className="relative mt-3">
                  <input
                    type="number"
                    min={1}
                    max={500}
                    step={1}
                    value={stalledAccounts}
                    onChange={(e) => setStalledAccounts(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)] shadow-[var(--shadow-xs)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={stalledAccounts}
                  onChange={(e) => setStalledAccounts(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--color-accent)]"
                />
                <div className="flex justify-between text-[10px] text-[var(--color-text-muted)]">
                  <span>1</span><span>50</span>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="flex flex-col gap-4">
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  First-service revenue at risk
                </p>
                <p
                  className="mt-2 text-5xl font-bold tracking-tight text-[var(--color-danger)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {fmt(revenueAtRisk)}
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {fmt(revenuePerAccount)} × {stalledAccounts} stalled account{stalledAccounts !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                  Recoverable with ClientEnforce
                </p>
                <p
                  className="mt-2 text-5xl font-bold tracking-tight text-[var(--color-accent)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {fmt(recoverable)}
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  Automated follow-up and required-step enforcement recover ~80% of stalled accounts in the first 30 days.
                </p>
              </div>

              <a
                href="https://calendar.app.google/QfkFs4hWUoCbKupj7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98]"
              >
                Book a 20-min walkthrough — see it live
              </a>
              <p className="text-center text-xs text-[var(--color-text-muted)]">
                No credit card required · Live in 20 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
