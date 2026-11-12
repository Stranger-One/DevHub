import { X } from "lucide-react";
import { useState, type FormEvent } from "react";

export type ProfileField = {
  name: string;
  label: string;
  value: string;
  multiline?: boolean;
  placeholder?: string;
};

type ProfileDialogProps = {
  title: string;
  description: string;
  fields: ProfileField[];
  open: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
};

export function ProfileDialog({
  title,
  description,
  fields,
  open,
  onClose,
  onSave,
}: ProfileDialogProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, field.value])),
  );

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(values);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[min(760px,92vh)] w-full max-w-xl overflow-y-auto rounded-2xl border border-border-strong bg-surface-raised shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
          <div>
            <h2 id="profile-dialog-title" className="text-xl font-semibold">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
          {fields.map((field) => (
            <label
              key={field.name}
              className="block text-sm font-medium text-text-secondary"
            >
              {field.label}
              {field.multiline ? (
                <textarea
                  value={values[field.name] ?? ""}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  rows={4}
                  className="mt-2 w-full resize-y rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary"
                />
              ) : (
                <input
                  value={values[field.name] ?? ""}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary"
                />
              )}
            </label>
          ))}
          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
