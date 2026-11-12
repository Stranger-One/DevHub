import {
  Code2,
  ExternalLink,
  Globe2,
  MapPin,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { LoadingScreen } from "../../components/feedback/LoadingScreen";
import {
  ProfileDialog,
  type ProfileField,
} from "../../components/profile/ProfileDialog";
import { ProfileImageUploader } from "../../components/profile/ProfileImageUploader";
import { ProfileSection } from "../../components/profile/ProfileSection";
import {
  selectCurrentProfile,
  selectProfileError,
  selectProfileFetchStatus,
  selectPublicProfile,
} from "../../features/profile/profileSelectors";
import {
  addCertification,
  addEducation,
  addExperience,
  deleteCertification,
  deleteEducation,
  deleteExperience,
  fetchMyProfile,
  fetchPublicProfile,
  updateAbout,
  updateCertification,
  updateEducation,
  updateExperience,
  updateIntroduction,
  updateSkills,
} from "../../features/profile/profileThunk";
import type {
  ProfileCertification,
  ProfileEducation,
  ProfileExperience,
} from "../../features/profile/profile.types";

type DialogState = {
  title: string;
  description: string;
  fields: ProfileField[];
  submitLabel?: string;
  save: (values: Record<string, string | boolean>) => void;
} | null;

const options = (values: string[]) =>
  values.map((value) => ({ label: value.replace("-", " "), value }));
const employmentOptions = options([
  "full-time",
  "part-time",
  "contract",
  "freelance",
  "internship",
]);
const workingOptions = options(["remote", "on-site", "hybrid"]);
const pronounOptions = options(["he/him", "she/her", "they/them", "other"]);
const text = (values: Record<string, string | boolean>, key: string) =>
  String(values[key] ?? "");
const checked = (values: Record<string, string | boolean>, key: string) =>
  Boolean(values[key]);
const dateLabel = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";
const years = (start?: string, end?: string, current?: boolean) =>
  start
    ? `${new Date(start).getFullYear()} - ${current ? "Present" : end ? new Date(end).getFullYear() : ""}`
    : "";

const fieldsFor = (
  values: Record<string, string | boolean>,
  fields: [
    string,
    string,
    ProfileField["type"]?,
    ProfileField["options"]?,
    boolean?,
    boolean?,
  ][],
): ProfileField[] =>
  fields.map(([name, label, type, fieldOptions, required, multiline]) => ({
    name,
    label,
    type,
    options: fieldOptions,
    value: values[name] ?? (type === "checkbox" ? false : ""),
    required,
    multiline,
  }));

export default function ProfilePage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const currentProfile = useAppSelector(selectCurrentProfile);
  const publicProfile = useAppSelector(selectPublicProfile(id ?? ""));
  const fetchStatus = useAppSelector(selectProfileFetchStatus);
  const error = useAppSelector(selectProfileError);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [imageDrafts, setImageDrafts] = useState<{
    profile?: string;
    cover?: string;
  }>({});
  const isOwner = !id || id === "me" || id === user?.id;
  const profile = isOwner ? currentProfile : publicProfile;

  useEffect(() => {
    if (isOwner) void dispatch(fetchMyProfile());
    else if (id) void dispatch(fetchPublicProfile(id));
  }, [dispatch, id, isOwner]);

  const openIntroductionEditor = () => {
    if (!profile) return;
    const intro = profile.introduction;
    setDialog({
      title: "Edit introduction",
      description: "Update your headline and location.",
      fields: fieldsFor(
        {
          firstName: intro.firstName,
          lastName: intro.lastName,
          pronouns: intro.pronouns,
          headline: intro.headline,
          country: intro.location.country,
          state: intro.location.state,
          city: intro.location.city,
          postalCode: intro.location.postalCode ?? "",
        },
        [
          ["firstName", "First name", "text", undefined, true],
          ["lastName", "Last name", "text", undefined, true],
          ["pronouns", "Pronouns", "select", pronounOptions],
          ["headline", "Headline", "text", undefined, true, true],
          ["country", "Country"],
          ["state", "State / province"],
          ["city", "City"],
          ["postalCode", "Postal code"],
        ],
      ),
      save: (values) => {
        void dispatch(
          updateIntroduction({
            firstName: text(values, "firstName"),
            lastName: text(values, "lastName"),
            pronouns: text(values, "pronouns") as typeof intro.pronouns,
            headline: text(values, "headline"),
            location: {
              country: text(values, "country"),
              state: text(values, "state"),
              city: text(values, "city"),
              postalCode: text(values, "postalCode"),
            },
          }),
        );
      },
    });
  };

  const openAboutEditor = () => {
    if (!profile) return;
    setDialog({
      title: "Edit about",
      description: "Tell people what kind of work you do best.",
      fields: fieldsFor(
        {
          description: profile.about.description,
          specialties: profile.about.specialties.join(", "),
        },
        [
          ["description", "Description", "text", undefined, true, true],
          ["specialties", "Specialties (comma separated)"],
        ],
      ),
      save: (values) => {
        void dispatch(
          updateAbout({
            description: text(values, "description"),
            specialties: text(values, "specialties")
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          }),
        );
      },
    });
  };
  const openSkillsEditor = () => {
    if (!profile) return;
    setDialog({
      title: "Edit skills",
      description: "Add the skills you want to be discovered for.",
      fields: fieldsFor({ skills: profile.skills.join(", ") }, [
        ["skills", "Skills (comma separated)"],
      ]),
      save: (values) => {
        void dispatch(
          updateSkills(
            text(values, "skills")
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          ),
        );
      },
    });
  };

  const openEducationEditor = (item?: ProfileEducation) =>
    setDialog({
      title: item ? "Update education" : "Add education",
      description: "Add a school, program, or course of study.",
      submitLabel: item ? "Update education" : undefined,
      fields: fieldsFor(
        item
          ? {
              institution: item.institution,
              degree: item.degree ?? "",
              fieldOfStudy: item.fieldOfStudy ?? "",
              startDate: item.startDate,
              endDate: item.endDate ?? "",
              currentlyStudying: item.currentlyStudying,
              description: item.description ?? "",
            }
          : {},
        [
          ["institution", "Institution", "text", undefined, true],
          ["degree", "Degree"],
          ["fieldOfStudy", "Field of study"],
          ["startDate", "Start date", "date", undefined, true],
          ["endDate", "End date", "date"],
          ["currentlyStudying", "Currently studying", "checkbox"],
          ["description", "Description", "text", undefined, false, true],
        ],
      ),
      save: (values) => {
        const input = {
          institution: text(values, "institution"),
          degree: text(values, "degree"),
          fieldOfStudy: text(values, "fieldOfStudy"),
          startDate: text(values, "startDate"),
          endDate: text(values, "endDate") || undefined,
          currentlyStudying: checked(values, "currentlyStudying"),
          description: text(values, "description"),
        };
        if (item) void dispatch(updateEducation({ id: item._id, input }));
        else void dispatch(addEducation(input));
      },
    });

  const openExperienceEditor = (item?: ProfileExperience) =>
    setDialog({
      title: item ? "Update experience" : "Add experience",
      description: "Showcase a role, contract, or meaningful project.",
      submitLabel: item ? "Update experience" : undefined,
      fields: fieldsFor(
        item
          ? {
              company: item.company,
              position: item.position,
              employmentType: item.employmentType ?? "",
              location: item.location ?? "",
              workingType: item.workingType ?? "",
              startDate: item.startDate ?? "",
              endDate: item.endDate ?? "",
              currentlyWorking: item.currentlyWorking,
              description: item.description,
              skills: item.skills.join(", "),
            }
          : {},
        [
          ["company", "Company", "text", undefined, true],
          ["position", "Position", "text", undefined, true],
          ["employmentType", "Employment type", "select", employmentOptions],
          ["location", "Location"],
          ["workingType", "Working arrangement", "select", workingOptions],
          ["startDate", "Start date", "date"],
          ["endDate", "End date", "date"],
          ["currentlyWorking", "Currently working", "checkbox"],
          ["description", "Description", "text", undefined, false, true],
          ["skills", "Skills (comma separated)"],
        ],
      ),
      save: (values) => {
        const input = {
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
        };
        if (item) void dispatch(updateExperience({ id: item._id, input }));
        else void dispatch(addExperience(input));
      },
    });

  const openCertificationEditor = (item?: ProfileCertification) =>
    setDialog({
      title: item ? "Update certification" : "Add certification",
      description: "Add a credential that supports your expertise.",
      submitLabel: item ? "Update certification" : undefined,
      fields: fieldsFor(
        item
          ? {
              name: item.name,
              issuingOrganization: item.issuingOrganization,
              issueDate: item.issueDate,
              expirationDate: item.expirationDate ?? "",
              doesNotExpire: item.doesNotExpire,
              credentialId: item.credentialId ?? "",
              credentialUrl: item.credentialUrl ?? "",
              skills: item.skills.join(", "),
            }
          : {},
        [
          ["name", "Certification name", "text", undefined, true],
          [
            "issuingOrganization",
            "Issuing organization",
            "text",
            undefined,
            true,
          ],
          ["issueDate", "Issue date", "date", undefined, true],
          ["expirationDate", "Expiration date", "date"],
          ["doesNotExpire", "Does not expire", "checkbox"],
          ["credentialId", "Credential ID"],
          ["credentialUrl", "Credential URL", "url"],
          ["skills", "Skills (comma separated)"],
        ],
      ),
      save: (values) => {
        const input = {
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
          media: item?.media ?? [],
        };
        if (item) void dispatch(updateCertification({ id: item._id, input }));
        else void dispatch(addCertification(input));
      },
    });

  if (fetchStatus === "loading" && !profile)
    return <LoadingScreen label="Loading profile..." />;
  if (!profile)
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-error/30 bg-surface p-8 text-center">
        <h1 className="text-xl font-semibold">Unable to load profile</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {error ?? "The requested developer profile is unavailable."}
        </p>
        <button
          type="button"
          onClick={() => {
            if (isOwner) void dispatch(fetchMyProfile());
            else if (id) void dispatch(fetchPublicProfile(id));
          }}
          className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );

  const updateImageDraft = (kind: "profile" | "cover", url: string) => {
    setImageDrafts((current) => ({ ...current, [kind]: url }));
    if (url)
      toast.info(
        "Image preview updated. A media upload endpoint is required to persist it.",
      );
  };
  const profilePictureUrl =
    imageDrafts.profile ?? profile.introduction.profilePicture.url;
  const coverImageUrl =
    imageDrafts.cover ?? profile.introduction.coverImage.url;
  const fullName = `${profile.introduction.firstName} ${profile.introduction.lastName}`;

  return (
    <div className="mx-auto max-w-[1180px] pb-10">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0 space-y-5">
          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_36px_rgba(0,0,0,0.12)]">
            <div className="h-36 bg-[linear-gradient(115deg,#23133e_0%,#341a5a_44%,#123c4e_100%)] sm:h-48">
              {coverImageUrl && (
                <img
                  src={coverImageUrl}
                  alt=""
                  className="h-full w-full object-cover opacity-60 mix-blend-screen"
                />
              )}
            </div>
            <div className="relative px-5 pb-5 sm:px-7 sm:pb-7">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt={fullName}
                  className="-mt-14 size-28 rounded-full border-4 border-surface object-cover shadow-xl sm:-mt-16 sm:size-32"
                />
              ) : (
                <div className="-mt-14 grid size-28 place-items-center rounded-full border-4 border-surface bg-primary-soft text-3xl font-bold text-accent-purple shadow-xl sm:-mt-16 sm:size-32">
                  {fullName.slice(0, 1)}
                </div>
              )}
              <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
                      {fullName}
                    </h1>
                    <span className="text-sm text-text-muted">
                      {profile.introduction.pronouns}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-base leading-7 text-text-secondary">
                    {profile.introduction.headline}
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-text-muted">
                    <MapPin size={15} className="text-accent-cyan" />
                    {profile.introduction.location.city},{" "}
                    {profile.introduction.location.state}
                  </p>
                </div>
                {isOwner ? (
                  <button
                    type="button"
                    onClick={openIntroductionEditor}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
                  >
                    <Sparkles size={16} />
                    Edit profile
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded-xl border border-border-strong px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-surface-hover"
                  >
                    Connect
                  </button>
                )}
              </div>
              {isOwner && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <ProfileImageUploader
                    label="Profile image"
                    value={profilePictureUrl}
                    circular
                    onChange={(url) => updateImageDraft("profile", url)}
                  />
                  <ProfileImageUploader
                    label="Cover image"
                    value={coverImageUrl}
                    onChange={(url) => updateImageDraft("cover", url)}
                  />
                </div>
              )}
            </div>
          </section>
          <ProfileSection
            title="About"
            onEdit={isOwner ? openAboutEditor : undefined}
          >
            <p className="text-sm leading-7 text-text-secondary">
              {profile.about.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.about.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full border border-border-strong bg-primary-soft px-3 py-1.5 text-xs font-medium text-accent-purple"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </ProfileSection>
          <ProfileSection
            title="Skills"
            onEdit={isOwner ? openSkillsEditor : undefined}
          >
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-text-secondary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </ProfileSection>
          <ProfileSection
            title="Experience"
            eyebrow={`${profile.experience.length} roles`}
            onAdd={isOwner ? () => openExperienceEditor() : undefined}
          >
            {profile.experience.map((item) => (
              <article
                key={item._id}
                className="border-b border-border pb-5 pt-1 last:border-0 last:pb-0"
              >
                <div className="flex gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-purple text-sm font-bold text-accent-purple">
                    {item.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-text-primary">
                      {item.position}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {item.company} · {item.employmentType}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      {years(
                        item.startDate,
                        item.endDate,
                        item.currentlyWorking,
                      )}{" "}
                      · {item.location} · {item.workingType}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      {item.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <span key={skill} className="text-xs text-accent-cyan">
                          {skill}
                        </span>
                      ))}
                    </div>
                    {isOwner && (
                      <div className="mt-3 flex gap-3">
                        <button
                          type="button"
                          onClick={() => openExperienceEditor(item)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent-cyan"
                        >
                          <Pencil size={13} />
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void dispatch(deleteExperience(item._id))
                          }
                          className="inline-flex items-center gap-1 text-xs font-semibold text-error"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </ProfileSection>
          <ProfileSection
            title="Education"
            eyebrow={`${profile.education.length} schools`}
            onAdd={isOwner ? () => openEducationEditor() : undefined}
          >
            {profile.education.map((item) => (
              <article
                key={item._id}
                className="flex gap-4 border-b border-border pb-5 pt-1 last:border-0 last:pb-0"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-purple text-accent-cyan">
                  {item.institution.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-text-primary">
                    {item.institution}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {item.degree}, {item.fieldOfStudy}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    {years(
                      item.startDate,
                      item.endDate,
                      item.currentlyStudying,
                    )}
                  </p>
                  {item.description && (
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      {item.description}
                    </p>
                  )}
                  {isOwner && (
                    <div className="mt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => openEducationEditor(item)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent-cyan"
                      >
                        <Pencil size={13} />
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => void dispatch(deleteEducation(item._id))}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-error"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </ProfileSection>
          <ProfileSection
            title="Licenses & certifications"
            onAdd={isOwner ? () => openCertificationEditor() : undefined}
          >
            {profile.certifications.map((item) => (
              <article
                key={item._id}
                className="flex gap-4 border-b border-border pb-5 pt-1 last:border-0 last:pb-0"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-white">
                  ✓
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-text-primary">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {item.issuingOrganization}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    Issued {dateLabel(item.issueDate)} · {item.credentialId}
                  </p>
                  {item.expirationDate && !item.doesNotExpire && (
                    <p className="mt-1 text-xs text-text-muted">
                      Expires {dateLabel(item.expirationDate)}
                    </p>
                  )}
                  {item.credentialUrl && (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent-cyan"
                    >
                      Show credential <ExternalLink size={13} />
                    </a>
                  )}
                  {isOwner && (
                    <div className="mt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => openCertificationEditor(item)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent-cyan"
                      >
                        <Pencil size={13} />
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void dispatch(deleteCertification(item._id))
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-error"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </ProfileSection>
        </main>
        <aside className="space-y-5">
          <ProfileSection title="Profile strength">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Complete profile</span>
              <strong className="text-accent-emerald">
                {profile.completionPercentage}%
              </strong>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-hover">
              <div
                className="h-full rounded-full bg-accent-emerald"
                style={{ width: `${profile.completionPercentage}%` }}
              />
            </div>
          </ProfileSection>
          <ProfileSection title="Contact & links">
            <div className="space-y-3">
              {profile.socialLinks.map((link) => (
                <a
                  key={link._id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-border-strong hover:bg-surface-hover"
                >
                  <span className="grid size-8 place-items-center rounded-lg bg-surface-purple text-accent-purple">
                    {link.platform === "GitHub" ? (
                      <Code2 size={16} />
                    ) : (
                      <Globe2 size={16} />
                    )}
                  </span>
                  <span className="min-w-0">
                    <strong className="block truncate text-sm text-text-primary">
                      {link.platform}
                    </strong>
                    <span className="block truncate text-xs text-text-muted">
                      {link.label}
                    </span>
                  </span>
                  <ExternalLink
                    size={14}
                    className="ml-auto shrink-0 text-text-muted"
                  />
                </a>
              ))}
            </div>
          </ProfileSection>
        </aside>
      </div>
      {dialog && (
        <ProfileDialog
          key={dialog.title}
          title={dialog.title}
          description={dialog.description}
          fields={dialog.fields}
          submitLabel={dialog.submitLabel}
          open
          onClose={() => setDialog(null)}
          onSave={dialog.save}
        />
      )}
    </div>
  );
}
