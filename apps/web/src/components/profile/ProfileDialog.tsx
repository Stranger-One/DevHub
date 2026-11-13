import { X } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { ReactNode } from "react";

export type ProfileField = {
  name: string;
  label: string;
  value?: string | boolean;
  type?: "text" | "date" | "url" | "select" | "checkbox" | "space";
  options?: { label: string; value: string }[];
  multiline?: boolean;
  placeholder?: string;
  required?: boolean;
  span?: number;
};

type ProfileDialogProps = {
  title: string;
  description: string;
  fields: ProfileField[];
  open: boolean;
  submitLabel?: string;
  disableSubmit?: boolean;
  children?: ReactNode;
  onClose: () => void;
  onSave: (values: Record<string, string | boolean>) => void;
};

const getColumnSpan = (span?: number) => {
  switch (span) {
    case 1:
      return "col-span-1";
    case 2:
      return "col-span-2";
    case 3:
      return "col-span-3";
    default:
      return "col-span-1";
  }
};

const getDateInputValue = (value?: string | boolean) =>
  typeof value === "string" ? value.slice(0, 10) : "";

export function ProfileDialog({
  title,
  description,
  fields,
  disableSubmit,
  open,
  submitLabel = "Save changes",
  children,
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
        field.type === "date"
          ? getDateInputValue(field.value)
          : (field.value ?? (field.type === "checkbox" ? false : "")),
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
        className="max-h-[min(800px,92vh)] w-full max-w-[min(900px,90vw)] overflow-y-auto rounded-2xl border border-border-strong bg-surface-raised shadow-2xl"
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
            className="grid size-9 shrink-0 place-items-center rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6"
        >
          {children}
          {fields.map((field) => {
            const fieldError = errors[field.name];
            if (field.type === "checkbox") {
              return (
                <label
                  key={field.name}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl py-3  px-3 text-sm text-text-secondary ${getColumnSpan(field.span)}`}
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
            if (field.type === "space") {
              return (
                <div
                  key={field.name}
                  className={` ${getColumnSpan(field.span)}`}
                />
              );
            }
            return (
              <label
                key={field.name}
                className={`block text-sm font-medium text-text-secondary ${getColumnSpan(field.span)}`}
              >
                {field.label}
                {field.type === "select" ? (
                  <select
                    {...register(field.name, {
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                    })}
                    className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options?.map((option) => (
                      <option
                        className="capitalize"
                        key={option.value}
                        value={option.value}
                      >
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
          <div className="flex justify-end gap-3 border-t border-border pt-5 col-span-full">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={disableSubmit}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
