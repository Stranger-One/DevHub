import { X } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

export type ProfileField = {
  name: string;
  label: string;
  value?: string | boolean;
  type?: "text" | "date" | "url" | "select" | "checkbox";
  options?: { label: string; value: string }[];
  multiline?: boolean;
  placeholder?: string;
  required?: boolean;
};

type ProfileDialogProps = {
  title: string;
  description: string;
  fields: ProfileField[];
  open: boolean;
  submitLabel?: string;
  onClose: () => void;
  onSave: (values: Record<string, string | boolean>) => void;
};

export function ProfileDialog({
  title,
  description,
  fields,
  open,
  submitLabel = "Save changes",
  onClose,
  onSave,
}: ProfileDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, string | boolean>>({
    defaultValues: Object.fromEntries(
      fields.map((field) => [
        field.name,
        field.value ?? (field.type === "checkbox" ? false : ""),
      ]),
    ),
  });
  const onSubmit: SubmitHandler<Record<string, string | boolean>> = (
    values,
  ) => {
    onSave(values);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-70 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[min(800px,92vh)] w-full max-w-xl overflow-y-auto rounded-2xl border border-border-strong bg-surface-raised shadow-2xl"
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-5 sm:p-6"
        >
          {fields.map((field) => {
            const fieldError = errors[field.name];
            if (field.type === "checkbox") {
              return (
                <label
                  key={field.name}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 text-sm text-text-secondary"
                >
                  <input
                    type="checkbox"
                    {...register(field.name)}
                    className="size-4 accent-primary"
                  />
                  {field.label}
                </label>
              );
            }
            return (
              <label
                key={field.name}
                className="block text-sm font-medium text-text-secondary"
              >
                {field.label}
                {field.type === "select" ? (
                  <select
                    {...register(field.name, {
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                    })}
                    className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary"
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.multiline ? (
                  <textarea
                    {...register(field.name, {
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                    })}
                    placeholder={field.placeholder}
                    rows={4}
                    className="mt-2 w-full resize-y rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary"
                  />
                ) : (
                  <input
                    type={field.type ?? "text"}
                    {...register(field.name, {
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                    })}
                    placeholder={field.placeholder}
                    className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary"
                  />
                )}
                {fieldError && (
                  <span className="mt-1 block text-xs text-error">
                    {String(fieldError.message)}
                  </span>
                )}
              </label>
            );
          })}
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
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
