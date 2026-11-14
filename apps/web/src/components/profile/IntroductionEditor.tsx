import { useState } from "react";
import { ProfileDialog, type ProfileField } from "./ProfileDialog";
import { ProfileImageUploader } from "./ProfileImageUploader";
import type { ProfileIntroduction } from "./profile.types";

type IntroductionEditorProps = {
  profile: ProfileIntroduction | undefined;
  open: boolean;
  onClose: () => void;
  onSave: (input: Partial<ProfileIntroduction>) => void;
};

const options = ["he/him", "she/her", "they/them", "other"].map((value) => ({
  label: value,
  value,
}));

const text = (values: Record<string, string | boolean>, key: string) =>
  String(values[key] ?? "");

export function IntroductionEditor({
  profile,
  open,
  onClose,
  onSave,
}: IntroductionEditorProps) {
  const [images, setImages] = useState({
    profile: profile?.profilePicture,
    cover: profile?.coverImage,
  });
  const [disableSubmit, setDisableSubmit] = useState(false)

  const fields: ProfileField[] = [
    {
      name: "firstName",
      label: "First name",
      value: profile?.firstName,
      required: true,
      span: 1,
    },
    {
      name: "lastName",
      label: "Last name",
      value: profile?.lastName,
      required: true,
      span: 1,
    },
    {
      name: "pronouns",
      label: "Pronouns",
      value: profile?.pronouns,
      type: "select",
      options,
      span: 1,
    },
    {
      name: "headline",
      label: "Headline",
      value: profile?.headline,
      required: true,
      multiline: true,
      span: 3,
    },
    {
      name: "country",
      label: "Country",
      value: profile?.location.country,
      span: 1,
    },
    {
      name: "state",
      label: "State / province",
      value: profile?.location.state,
      span: 1,
    },
    { name: "city", label: "City", value: profile?.location.city, span: 1 },
    {
      name: "postalCode",
      label: "Postal code",
      value: profile?.location.postalCode ?? "",
      span: 1,
    },
  ];

  return (
    <ProfileDialog
      title="Edit introduction"
      description="Update your headline, location, and profile imagery."
      disableSubmit={disableSubmit}
      fields={fields}
      open={open}
      onClose={onClose}
      onSave={(values) =>
        onSave({
          firstName: text(values, "firstName"),
          lastName: text(values, "lastName"),
          pronouns: text(values, "pronouns"),
          headline: text(values, "headline"),
          profilePicture: images.profile,
          coverImage: images.cover,
          location: {
            country: text(values, "country"),
            state: text(values, "state"),
            city: text(values, "city"),
            postalCode: text(values, "postalCode"),
          },
        })
      }
    >
      <div className="col-span-full grid gap-3 sm:grid-cols-2">
        <ProfileImageUploader
          label="Profile image"
          value={profile?.profilePicture.url}
          circular
          onChange={(url, publicId) =>
            setImages((current) => ({ ...current, profile: { url, publicId } }))
          }
          setDisableSubmit={setDisableSubmit}
        />
        <ProfileImageUploader
          label="Cover image"
          value={profile?.coverImage.url}
          onChange={(url, publicId) =>
            setImages((current) => ({ ...current, cover: { url, publicId } }))
          }
          setDisableSubmit={setDisableSubmit}
        />
      </div>
    </ProfileDialog>
  );
}
