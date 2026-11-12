import { Pencil, Plus } from "lucide-react";
import type { ReactNode } from "react";

type ProfileSectionProps = {
  title: string;
  eyebrow?: string;
  onEdit?: () => void;
  onAdd?: () => void;
  children: ReactNode;
};

export function ProfileSection({
  title,
  eyebrow,
  onEdit,
  onAdd,
  children,
}: ProfileSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-[0_12px_36px_rgba(0,0,0,0.12)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-purple">
              {eyebrow}
            </p>
          )}
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-text-primary">
            {title}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              aria-label={`Add ${title}`}
              className="grid size-9 place-items-center rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-purple"
            >
              <Plus size={17} />
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${title}`}
              className="grid size-9 place-items-center rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-accent-purple"
            >
              <Pencil size={16} />
            </button>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
