import { ProfileDialog, type ProfileField } from "./ProfileDialog";
import type { ProfileEducation } from "./profile.types";

type EducationEditorProps = {
  value?: ProfileEducation;
  open: boolean;
  onClose: () => void;
  onSave: (input: Omit<ProfileEducation, "_id">) => void;
};

const text = (values: Record<string, string | boolean>, key: string) =>
  String(values[key] ?? "");
const checked = (values: Record<string, string | boolean>, key: string) =>
  Boolean(values[key]);

export function EducationEditor({
  value,
  open,
  onClose,
  onSave,
}: EducationEditorProps) {
  const fields: ProfileField[] = [
    {
      name: "institution",
      label: "Institution",
      value: value?.institution,
      required: true,
      span: 1,
    },
    { name: "degree", label: "Degree", value: value?.degree ?? "", span: 1 },
    {
      name: "fieldOfStudy",
      label: "Field of study",
      value: value?.fieldOfStudy ?? "",
      span: 1,
    },
    {
      name: "startDate",
      label: "Start date",
      value: value?.startDate,
      type: "date",
      required: true,
      span: 1,
    },
    {
      name: "endDate",
      label: "End date",
      value: value?.endDate ?? "",
      type: "date",
      span: 1,
    },
    {
      name: "currentlyStudying",
      label: "Currently studying",
      value: value?.currentlyStudying ?? false,
      type: "checkbox",
      span: 1,
    },
    {
      name: "description",
      label: "Description",
      value: value?.description ?? "",
      multiline: true,
      span: 3,
    },
  ];

  return (
    <ProfileDialog
      title={value ? "Update education" : "Add education"}
      description="Add a school, program, or course of study."
      fields={fields}
      open={open}
      submitLabel={value ? "Update education" : undefined}
      onClose={onClose}
      onSave={(values) =>
        onSave({
          institution: text(values, "institution"),
          degree: text(values, "degree"),
          fieldOfStudy: text(values, "fieldOfStudy"),
          startDate: text(values, "startDate"),
          endDate: text(values, "endDate") || undefined,
          currentlyStudying: checked(values, "currentlyStudying"),
          description: text(values, "description"),
        })
      }
    />
  );
}
