import { ProfileDialog, type ProfileField } from "./ProfileDialog";
import type { ProfileExperience } from "./profile.types";

type ExperienceEditorProps = {
  value?: ProfileExperience;
  open: boolean;
  onClose: () => void;
  onSave: (input: Omit<ProfileExperience, "_id">) => void;
};
const text = (values: Record<string, string | boolean>, key: string) =>
  String(values[key] ?? "");
const checked = (values: Record<string, string | boolean>, key: string) =>
  Boolean(values[key]);
const employmentOptions = [
  "full-time",
  "part-time",
  "contract",
  "freelance",
  "internship",
].map((value) => ({ label: value.replace("-", " "), value }));
const workingOptions = ["remote", "on-site", "hybrid"].map((value) => ({
  label: value,
  value,
}));

export function ExperienceEditor({
  value,
  open,
  onClose,
  onSave,
}: ExperienceEditorProps) {
  const fields: ProfileField[] = [
    {
      name: "company",
      label: "Company",
      value: value?.company,
      required: true,
      span: 1,
    },
    {
      name: "position",
      label: "Position",
      value: value?.position,
      required: true,
      span: 1,
    },
    {
      name: "location",
      label: "Location",
      value: value?.location ?? "",
      span: 1,
    },
    {
      name: "employmentType",
      label: "Employment type",
      value: value?.employmentType ?? "",
      type: "select",
      options: employmentOptions,
      span: 1,
    },
    {
      name: "workingType",
      label: "Working arrangement",
      value: value?.workingType ?? "",
      type: "select",
      options: workingOptions,
      span: 1,
    },
    {
      name: "startDate",
      label: "Start date",
      value: value?.startDate ?? "",
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
      name: "currentlyWorking",
      label: "Currently working",
      value: value?.currentlyWorking ?? false,
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
    {
      name: "skills",
      label: "Skills (comma separated)",
      value: value?.skills.join(", ") ?? "",
      span: 3,
    },
  ];

  return (
    <ProfileDialog
      title={value ? "Update experience" : "Add experience"}
      description="Showcase a role, contract, or meaningful project."
      fields={fields}
      open={open}
      submitLabel={value ? "Update experience" : undefined}
      onClose={onClose}
      onSave={(values) =>
        onSave({
          company: text(values, "company"),
          position: text(values, "position"),
          employmentType: text(
            values,
            "employmentType",
          ) as ProfileExperience["employmentType"],
          location: text(values, "location"),
          workingType: text(
            values,
            "workingType",
          ) as ProfileExperience["workingType"],
          startDate: text(values, "startDate") || undefined,
          endDate: text(values, "endDate") || undefined,
          currentlyWorking: checked(values, "currentlyWorking"),
          description: text(values, "description"),
          skills: text(values, "skills")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        })
      }
    />
  );
}
