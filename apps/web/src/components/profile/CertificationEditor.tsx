import { ProfileDialog, type ProfileField } from "./ProfileDialog";
import type { ProfileCertification } from "./profile.types";

type CertificationEditorProps = {
  value?: ProfileCertification;
  open: boolean;
  onClose: () => void;
  onSave: (input: Omit<ProfileCertification, "_id">) => void;
};
const text = (values: Record<string, string | boolean>, key: string) =>
  String(values[key] ?? "");
const checked = (values: Record<string, string | boolean>, key: string) =>
  Boolean(values[key]);

export function CertificationEditor({
  value,
  open,
  onClose,
  onSave,
}: CertificationEditorProps) {
  const fields: ProfileField[] = [
    {
      name: "name",
      label: "Certification name",
      value: value?.name,
      required: true,
      span: 1,
    },
    {
      name: "issuingOrganization",
      label: "Issuing organization",
      value: value?.issuingOrganization,
      required: true,
      span: 1,
    },
    {
      name: "issueDate",
      label: "Issue date",
      value: value?.issueDate,
      type: "date",
      required: true,
      span: 1,
    },
    {
      name: "expirationDate",
      label: "Expiration date",
      value: value?.expirationDate ?? "",
      type: "date",
      span: 1,
    },
    {
      name: "doesNotExpire",
      label: "Does not expire",
      value: value?.doesNotExpire ?? false,
      type: "checkbox",
      span: 1,
    },
    {
      name: "credentialId",
      label: "Credential ID",
      value: value?.credentialId ?? "",
      span: 1,
    },
    {
      name: "credentialUrl",
      label: "Credential URL",
      value: value?.credentialUrl ?? "",
      type: "url",
      span: 1,
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
      title={value ? "Update certification" : "Add certification"}
      description="Add a credential that supports your expertise."
      fields={fields}
      open={open}
      submitLabel={value ? "Update certification" : undefined}
      onClose={onClose}
      onSave={(values) =>
        onSave({
          name: text(values, "name"),
          issuingOrganization: text(values, "issuingOrganization"),
          issueDate: text(values, "issueDate"),
          expirationDate: text(values, "expirationDate") || undefined,
          doesNotExpire: checked(values, "doesNotExpire"),
          credentialId: text(values, "credentialId"),
          credentialUrl: text(values, "credentialUrl") || undefined,
          skills: text(values, "skills")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          media: value?.media ?? [],
        })
      }
    />
  );
}
