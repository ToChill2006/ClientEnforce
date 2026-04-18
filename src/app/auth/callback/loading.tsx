export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
        <div className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-[var(--shadow-sm)]">
          <div className="text-sm text-[var(--color-text-muted)]">Loading authentication…</div>
        </div>
      </div>
    </main>
  );
}
