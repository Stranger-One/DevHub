import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

type ProfileImageUploaderProps = {
  label: string;
  value?: string;
  circular?: boolean;
  onChange: (url: string) => void;
};

export function ProfileImageUploader({
  label,
  value,
  circular = false,
  onChange,
}: ProfileImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  const selectImage = () => inputRef.current?.click();
  const handleFile = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(url);
  };
  const removeImage = () => {
    setPreview(undefined);
    onChange("");
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="flex items-center gap-3">
        <div
          className={`${circular ? "size-14 rounded-full" : "h-14 w-24 rounded-lg"} grid shrink-0 place-items-center overflow-hidden bg-surface-purple`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={19} className="text-accent-purple" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-primary">{label}</p>
          <p className="mt-1 text-xs text-text-muted">JPG, PNG, or WebP</p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={selectImage}
            aria-label={preview ? `Change ${label}` : `Add ${label}`}
            className="grid size-9 place-items-center rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary"
          >
            <Upload size={16} />
          </button>
          {preview && (
            <button
              type="button"
              onClick={removeImage}
              aria-label={`Remove ${label}`}
              className="grid size-9 place-items-center rounded-lg text-text-muted hover:bg-error/10 hover:text-error"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
