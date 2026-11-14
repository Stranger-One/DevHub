import { ProfileDialog, type ProfileField } from "./ProfileDialog";

type AboutEditorProps = {
  value: { description: string; specialties: string[] } | undefined;
  open: boolean;
  onClose: () => void;
  onSave: (input: { description: string; specialties: string[] }) => void;
};

export function AboutEditor({
  value,
  open,
  onClose,
  onSave,
}: AboutEditorProps) {
  const fields: ProfileField[] = [
    {
      name: "description",
      label: "Description",
      value: value?.description,
      required: true,
      multiline: true,
      span: 3,
    },
    {
      name: "specialties",
      label: "Specialties (comma separated)",
      value: value?.specialties.join(", "),
      span: 3,
    },
  ];

  return (
    <ProfileDialog
      title="Edit about"
      description="Tell people what kind of work you do best."
      fields={fields}
      open={open}
      onClose={onClose}
      onSave={(values) =>
        onSave({
          description: String(values.description ?? ""),
          specialties: String(values.specialties ?? "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        })
      }
    />
  );
}
