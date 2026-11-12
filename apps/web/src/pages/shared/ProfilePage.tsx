import {
  ExternalLink,
  Code2,
  Globe2,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import {
  ProfileDialog,
  type ProfileField,
} from "../../components/profile/ProfileDialog";
import { ProfileSection } from "../../components/profile/ProfileSection";
import type { DeveloperProfile } from "../../components/profile/profile.types";

const profileSeed: DeveloperProfile = {
  _id: "6af4a617c397026e9e50f5e3",
  userId: "6af2b3f8c2ebd3245bde9743",
  introduction: {
    profilePicture: {
      url: "https://res.cloudinary.com/demo/image/upload/v1/profiles/alex-morgan.jpg",
    },
    coverImage: {
      url: "https://res.cloudinary.com/demo/image/upload/v1/covers/alex-cover.jpg",
    },
    location: {
      country: "London",
      state: "British Columbia",
      city: "Vancouver",
    },
    firstName: "Alex",
    lastName: "Morgan",
    pronouns: "they/them",
    headline: "Senior frontend engineer building inclusive digital products",
  },
  about: {
    description:
      "I help teams create maintainable, accessible, and delightful web experiences.",
    specialties: [
      "Accessibility",
      "Frontend architecture",
      "Design systems",
      "Performance optimization",
    ],
  },
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "GraphQL",
    "Playwright",
  ],
  education: [
    {
      _id: "education-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2017-09-01",
      endDate: "2021-05-30",
      currentlyStudying: false,
      description:
        "Studied software engineering, databases, distributed systems, and algorithms.",
    },
    {
      _id: "education-2",
      institution: "British Columbia Institute of Technology",
      degree: "Advanced Diploma",
      fieldOfStudy: "Web Development",
      startDate: "2018-09-01",
      endDate: "2020-05-30",
      currentlyStudying: false,
      description: "Updated education information.",
    },
  ],
  experience: [
    {
      _id: "experience-1",
      company: "Northstar Labs",
      position: "Senior Full-Stack Developer",
      employmentType: "full-time",
      location: "San Francisco, California",
      workingType: "hybrid",
      startDate: "2022-01-10",
      currentlyWorking: true,
      description:
        "Building scalable web applications and internal developer platforms.",
      skills: ["TypeScript", "React", "Node.js", "MongoDB"],
    },
    {
      _id: "experience-2",
      company: "CloudBridge Technologies",
      position: "Lead Full-Stack Developer",
      employmentType: "contract",
      location: "Remote",
      workingType: "remote",
      startDate: "2020-06-01",
      endDate: "2021-02-28",
      currentlyWorking: false,
      description:
        "Leading development of internal platforms and customer-facing tools.",
      skills: ["Node.js", "Express", "MongoDB", "React"],
    },
  ],
  certifications: [
    {
      _id: "certification-1",
      name: "AWS Certified Developer - Associate",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2023-06-15",
      doesNotExpire: true,
      credentialId: "AWS-DEV-123456",
      credentialUrl: "https://aws.amazon.com/verification",
      skills: ["AWS", "Cloud deployment", "Serverless"],
      media: [],
    },
    {
      _id: "certification-2",
      name: "Professional Scrum Master I",
      issuingOrganization: "Scrum.org",
      issueDate: "2022-04-15",
      doesNotExpire: true,
      credentialId: "PSM-I-789456",
      credentialUrl: "https://www.scrum.org/certificates/updated",
      skills: ["Scrum", "Agile planning", "Team leadership"],
      media: [],
    },
  ],
  socialLinks: [
    {
      _id: "link-1",
      platform: "GitHub",
      label: "Open-source projects",
      url: "https://github.com/mayajohnson",
    },
    {
      _id: "link-2",
      platform: "Portfolio",
      label: "Personal website",
      url: "https://mayajohnson.dev",
    },
  ],
  completionPercentage: 100,
};

type DialogState = {
  title: string;
  description: string;
  fields: ProfileField[];
  submitLabel?: string;
  save: (values: Record<string, string | boolean>) => void;
} | null;
const years = (startDate?: string, endDate?: string, current?: boolean) =>
  startDate
    ? `${new Date(startDate).getFullYear()} - ${current ? "Present" : endDate ? new Date(endDate).getFullYear() : ""}`
    : "";
const dateLabel = (date: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";
const fieldsFor = (
  values: Partial<Record<string, string | boolean>>,
  fields: [
    string,
    string,
    ProfileField["type"]?,
    ProfileField["options"]?,
    boolean?,
    boolean?,
  ][],
): ProfileField[] =>
  fields.map(([name, label, type, options, required, multiline]) => ({
    name,
    label,
    value: values[name] ?? (type === "checkbox" ? false : ""),
    type,
    options,
    multiline,
    required: required === true && type !== "checkbox",
  }));

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
const pronounOptions = ["he/him", "she/her", "they/them", "other"].map(
  (value) => ({ label: value, value }),
);

export default function ProfilePage() {
  const { id } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(profileSeed);
  const [dialog, setDialog] = useState<DialogState>(null);
  const isOwner = !id || id === "me" || profile.userId === user?.id;
  const fullName = `${profile.introduction.firstName} ${profile.introduction.lastName}`;

  const openIntroductionEditor = () =>
    setDialog({
      title: "Edit introduction",
      description: "Keep the first impression of your profile current.",
      fields: fieldsFor(
        {
          firstName: profile.introduction.firstName,
          lastName: profile.introduction.lastName,
          pronouns: profile.introduction.pronouns,
          headline: profile.introduction.headline,
          country: profile.introduction.location.country,
          state: profile.introduction.location.state,
          city: profile.introduction.location.city,
          postalCode: profile.introduction.location.postalCode,
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
      save: (values) =>
        setProfile((current) => ({
          ...current,
          introduction: {
            ...current.introduction,
            firstName: String(values.firstName),
            lastName: String(values.lastName),
            pronouns: String(
              values.pronouns,
            ) as typeof current.introduction.pronouns,
            headline: String(values.headline),
            location: {
              country: String(values.country),
              state: String(values.state),
              city: String(values.city),
              postalCode: String(values.postalCode),
            },
          },
        })),
    });
  const openAboutEditor = () =>
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
      save: (values) =>
        setProfile((current) => ({
          ...current,
          about: {
            description: String(values.description),
            specialties: String(values.specialties)
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          },
        })),
    });
  const openSkillsEditor = () =>
    setDialog({
      title: "Edit skills",
      description: "Add the skills you want to be discovered for.",
      fields: fieldsFor({ skills: profile.skills.join(", ") }, [
        ["skills", "Skills (comma separated)"],
      ]),
      save: (values) =>
        setProfile((current) => ({
          ...current,
          skills: String(values.skills)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        })),
    });
  const openEducationEditor = (item?: (typeof profile.education)[number]) =>
    setDialog({
      title: item ? "Update education" : "Add education",
      description: "Add a school, program, or course of study.",
      submitLabel: item ? "Update education" : undefined,
      fields: fieldsFor(
        item
          ? {
              institution: item.institution,
              degree: item.degree,
              fieldOfStudy: item.fieldOfStudy,
              startDate: item.startDate,
              endDate: item.endDate,
              currentlyStudying: item.currentlyStudying,
              description: item.description,
            }
          : {},
        [
          ["institution", "Institution", "text", undefined, true],
          ["degree", "Degree"],
          ["fieldOfStudy", "Field of study"],
          ["startDate", "Start date", "date", undefined, true],
          ["endDate", "End date", "date"],
          ["currentlyStudying", "Currently studying", "checkbox"],
          ["description", "Description", "text"],
        ],
      ),
      save: (values) =>
        setProfile((current) => ({
          ...current,
          education: item
            ? current.education.map((entry) =>
                entry._id === item._id
                  ? {
                      ...entry,
                      institution: String(values.institution),
                      degree: String(values.degree),
                      fieldOfStudy: String(values.fieldOfStudy),
                      startDate: String(values.startDate),
                      endDate: String(values.endDate),
                      currentlyStudying: Boolean(values.currentlyStudying),
                      description: String(values.description),
                    }
                  : entry,
              )
            : [
                ...current.education,
                {
                  _id: crypto.randomUUID(),
                  institution: String(values.institution),
                  degree: String(values.degree),
                  fieldOfStudy: String(values.fieldOfStudy),
                  startDate: String(values.startDate),
                  endDate: String(values.endDate),
                  currentlyStudying: Boolean(values.currentlyStudying),
                  description: String(values.description),
                },
              ],
        })),
    });
  const openExperienceEditor = (item?: (typeof profile.experience)[number]) =>
    setDialog({
      title: item ? "Update experience" : "Add experience",
      description: "Showcase a role, contract, or meaningful project.",
      submitLabel: item ? "Update experience" : undefined,
      fields: fieldsFor(
        item ? { ...item, skills: item.skills.join(", ") } : {},
        [
          ["company", "Company", "text", undefined, true],
          ["position", "Position", "text", undefined, true],
          ["employmentType", "Employment type", "select", employmentOptions],
          ["location", "Location"],
          ["workingType", "Working arrangement", "select", workingOptions],
          ["startDate", "Start date", "date"],
          ["endDate", "End date", "date"],
          ["currentlyWorking", "Currently working", "checkbox"],
          ["description", "Description", "text"],
          ["skills", "Skills (comma separated)"],
        ],
      ),
      save: (values) =>
        setProfile((current) => {
          const next = {
            _id: item?._id ?? crypto.randomUUID(),
            company: String(values.company),
            position: String(values.position),
            employmentType: String(
              values.employmentType,
            ) as (typeof profile.experience)[number]["employmentType"],
            location: String(values.location),
            workingType: String(
              values.workingType,
            ) as (typeof profile.experience)[number]["workingType"],
            startDate: String(values.startDate),
            endDate: String(values.endDate),
            currentlyWorking: Boolean(values.currentlyWorking),
            description: String(values.description),
            skills: String(values.skills)
              .split(",")
              .map((entry) => entry.trim())
              .filter(Boolean),
          };
          return {
            ...current,
            experience: item
              ? current.experience.map((entry) =>
                  entry._id === item._id ? next : entry,
                )
              : [...current.experience, next],
          };
        }),
    });
  const openCertificationEditor = (
    item?: (typeof profile.certifications)[number],
  ) =>
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
              expirationDate: item.expirationDate,
              doesNotExpire: item.doesNotExpire,
              credentialId: item.credentialId,
              credentialUrl: item.credentialUrl,
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
      save: (values) =>
        setProfile((current) => {
          const next = {
            _id: item?._id ?? crypto.randomUUID(),
            name: String(values.name),
            issuingOrganization: String(values.issuingOrganization),
            issueDate: String(values.issueDate),
            expirationDate: String(values.expirationDate),
            doesNotExpire: Boolean(values.doesNotExpire),
            credentialId: String(values.credentialId),
            credentialUrl: String(values.credentialUrl),
            skills: String(values.skills)
              .split(",")
              .map((entry) => entry.trim())
              .filter(Boolean),
            media: item?.media ?? [],
          };
          return {
            ...current,
            certifications: item
              ? current.certifications.map((entry) =>
                  entry._id === item._id ? next : entry,
                )
              : [...current.certifications, next],
          };
        }),
    });

  return (
    <div className="mx-auto max-w-295 pb-10">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0 space-y-5">
          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_36px_rgba(0,0,0,0.12)]">
            <div className="h-36 bg-[linear-gradient(115deg,#23133e_0%,#341a5a_44%,#123c4e_100%)] sm:h-48">
              {profile.introduction.coverImage.url && (
                <img
                  src={profile.introduction.coverImage.url}
                  alt=""
                  className="h-full w-full object-cover opacity-60 mix-blend-screen"
                />
              )}
            </div>
            <div className="relative px-5 pb-5 sm:px-7 sm:pb-7">
              {profile.introduction.profilePicture.url ? (
                <img
                  src={profile.introduction.profilePicture.url}
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
            onAdd={isOwner ? openExperienceEditor : undefined}
          >
            {profile.experience.map((item) => (
              <article
                key={item._id}
                className="relative border-b border-border pb-5 pt-1 last:border-0 last:pb-0"
              >
                <div className="flex gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-purple text-sm font-bold text-accent-purple">
                    {item.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
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
                      <button
                        type="button"
                        onClick={() => openExperienceEditor(item)}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent-cyan hover:text-text-primary"
                      >
                        <Pencil size={13} /> Update experience
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </ProfileSection>
          <ProfileSection
            title="Education"
            eyebrow={`${profile.education.length} schools`}
            onAdd={isOwner ? openEducationEditor : undefined}
          >
            {profile.education.map((item) => (
              <article
                key={item._id}
                className="flex gap-4 border-b border-border pb-5 pt-1 last:border-0 last:pb-0"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-purple text-accent-cyan">
                  {item.institution.slice(0, 1)}
                </div>
                <div>
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
                    <button
                      type="button"
                      onClick={() => openEducationEditor(item)}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent-cyan hover:text-text-primary"
                    >
                      <Pencil size={13} /> Update education
                    </button>
                  )}
                </div>
              </article>
            ))}
          </ProfileSection>
          <ProfileSection
            title="Licenses & certifications"
            onAdd={isOwner ? openCertificationEditor : undefined}
          >
            {profile.certifications.map((item) => (
              <article
                key={item._id}
                className="flex gap-4 border-b border-border pb-5 pt-1 last:border-0 last:pb-0"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-white">
                  ✓
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-text-primary">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {item.issuingOrganization}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    Issued {dateLabel(item.issueDate)} · {item.credentialId}
                  </p>
                  {item.credentialUrl && (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent-cyan hover:text-text-primary"
                    >
                      Show credential <ExternalLink size={13} />
                    </a>
                  )}
                  {item.expirationDate && !item.doesNotExpire && (
                    <p className="mt-1 text-xs text-text-muted">
                      Expires {dateLabel(item.expirationDate)}
                    </p>
                  )}
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => openCertificationEditor(item)}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent-cyan hover:text-text-primary"
                    >
                      <Pencil size={13} /> Update certification
                    </button>
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
            <p className="mt-3 text-xs leading-5 text-text-muted">
              A complete profile helps the right people find you.
            </p>
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
          <div className="rounded-2xl border border-dashed border-border-strong bg-primary-soft/40 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Plus size={16} className="text-accent-purple" />
              Showcase your work
            </div>
            <p className="mt-2 text-xs leading-5 text-text-secondary">
              Projects and activity will appear here as you build your DevHub
              presence.
            </p>
          </div>
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
