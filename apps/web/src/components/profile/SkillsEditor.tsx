import { ProfileDialog, type ProfileField } from "./ProfileDialog";

type SkillsEditorProps = {
  value: string[];
  open: boolean;
  onClose: () => void;
  onSave: (skills: string[]) => void;
};

export function SkillsEditor({
  value,
  open,
  onClose,
  onSave,
}: SkillsEditorProps) {
  const fields: ProfileField[] = [
    {
      name: "skills",
      label: "Skills (comma separated)",
      value: value.join(", "),
      span: 3,
    },
  ];

  return (
    <ProfileDialog
      title="Edit skills"
      description="Add the skills you want to be discovered for."
      fields={fields}
      open={open}
      onClose={onClose}
      onSave={(values) =>
        onSave(
          String(values.skills ?? "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        )
      }
    />
  );
}
