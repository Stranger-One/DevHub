export function LoadingScreen({ label = "Loading…" }: { label?: string }) {
  return (
    <main
      className="grid min-h-screen place-items-center bg-background text-text-secondary"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <span
          className="size-8 animate-spin rounded-full border-2 border-border border-t-primary"
          aria-hidden="true"
        />
        <p>{label}</p>
      </div>
    </main>
  );
}
