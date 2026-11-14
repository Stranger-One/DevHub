import { ProfileDialog, type ProfileField } from "./ProfileDialog";
import type { SocialLinkInput } from "../../features/profile/profile.types";

type SocialLink = SocialLinkInput & { _id: string };

type SocialLinkEditorProps = {
  value?: SocialLink;
  open: boolean;
  onClose: () => void;
  onSave: (input: SocialLinkInput) => void;
};

export function SocialLinkEditor({
  value,
  open,
  onClose,
  onSave,
}: SocialLinkEditorProps) {
  const fields: ProfileField[] = [
    {
      name: "platform",
      label: "Platform",
      value: value?.platform ?? "",
      required: true,
      span: 1,
    },
    {
      name: "label",
      label: "Label",
      value: value?.label ?? "",
      span: 1,
    },
    {
      name: "url",
      label: "URL",
      value: value?.url ?? "",
      type: "url",
      required: true,
      span: 3,
    },
  ];

  return (
    <ProfileDialog
      title={value ? "Update social link" : "Add social link"}
      description="Add a professional profile, portfolio, or personal website."
      fields={fields}
      open={open}
      submitLabel={value ? "Update link" : "Add link"}
      onClose={onClose}
      onSave={(values) =>
        onSave({
          platform: String(values.platform ?? ""),
          label: String(values.label ?? "") || undefined,
          url: String(values.url ?? ""),
        })
      }
    />
  );
}
