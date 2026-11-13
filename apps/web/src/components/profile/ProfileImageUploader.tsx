import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadMedia } from "../../services/cloudinary/upload.service";

type ProfileImageUploaderProps = {
  label: string;
  value?: string;
  circular?: boolean;
  onChange: (url: string, publicId: string) => void;
  setDisableSubmit?: (value: boolean) => void;
};

export function ProfileImageUploader({
  label,
  value,
  circular = false,
  onChange,
  setDisableSubmit,
}: ProfileImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>();
  const [removed, setRemoved] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const selectImage = () => inputRef.current?.click();
  const visiblePreview = removed ? undefined : (preview ?? value);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.info("Only JPG, PNG and WEBP are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.info("Maximum file size is 5 MB");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setRemoved(false);
    setProgress(0);
    setLoading(true);
    setDisableSubmit?.(true);

    try {
      const result = await uploadMedia(file, "image", setProgress);
      onChange(result.secure_url, result.public_id);
      toast.success(`${label} uploaded`);
    } catch (error) {
      console.error("Upload failed:", error);
      setPreview(undefined);
      setRemoved(false);
      toast.error(`Unable to upload ${label.toLowerCase()}`);
    } finally {
      setLoading(false);
      setDisableSubmit?.(false);
      URL.revokeObjectURL(localPreview);
      event.target.value = "";
    }
  };

  const removeImage = () => {
    setPreview(undefined);
    setRemoved(true);
    onChange("", "");
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
            onChange={handleUpload}
          />
          {visiblePreview ? (
            <img
              src={visiblePreview}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus size={19} className="text-accent-purple" />
          )}
        </div>
        {loading ? (
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Uploading {label.toLowerCase()}</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-hover">
              <div
                className="h-full rounded-full bg-accent-cyan transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary">{label}</p>
            <p className="mt-1 text-xs text-text-muted">JPG, PNG, or WebP</p>
          </div>
        )}

        <div className="flex gap-1">
          <button
            type="button"
            onClick={selectImage}
            aria-label={preview ? `Change ${label}` : `Add ${label}`}
            disabled={loading}
            className="grid size-9 place-items-center rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <Upload size={16} />
          </button>
          {visiblePreview && (
            <button
              type="button"
              onClick={removeImage}
              aria-label={`Remove ${label}`}
              className="grid size-9 place-items-center rounded-lg text-text-muted hover:bg-error/10 hover:text-error cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
