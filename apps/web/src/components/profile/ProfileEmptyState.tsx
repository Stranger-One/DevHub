import { ArrowRight, RefreshCw, Sparkles, UserRound } from "lucide-react";

type ProfileEmptyStateProps = {
  isOwner: boolean;
  error?: string | null;
  onCreate: () => void;
  onRetry: () => void;
};

export function ProfileEmptyState({
  isOwner,
  error,
  onCreate,
  onRetry,
}: ProfileEmptyStateProps) {
  return (
    <section className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(145,75,255,0.2),transparent_38%),radial-gradient(circle_at_85%_100%,rgba(34,199,242,0.12),transparent_35%)]" />
      <div className="relative px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-border-strong bg-surface-purple text-accent-purple shadow-lg">
          {isOwner ? <Sparkles size={28} /> : <UserRound size={28} />}
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-accent-cyan">
          {isOwner ? "Your developer presence" : "Developer profile"}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-text-primary sm:text-4xl">
          {isOwner
            ? "Your profile is ready to take shape"
            : "Profile not found"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-text-secondary sm:text-base">
          {isOwner
            ? "Add your introduction to create your profile. You can build out your skills, experience, education, and links afterward."
            : (error ?? "This developer has not created a public profile yet.")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {isOwner ? (
            <button
              type="button"
              onClick={onCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(145,75,255,0.25)] hover:bg-primary-hover"
            >
              Create profile <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-xl border border-border-strong px-5 py-3 text-sm font-semibold text-text-primary hover:bg-surface-hover"
            >
              <RefreshCw size={16} /> Try again
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
