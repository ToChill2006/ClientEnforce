export function percent(completed: number, total: number) {
  if (total <= 0) return 0;
  const p = Math.round((completed / total) * 100);
  return Math.max(0, Math.min(100, p));
}