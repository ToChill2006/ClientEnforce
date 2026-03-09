export function PageLoading({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="p-6 text-sm text-zinc-500">
      {message}
    </div>
  );
}

