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
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { LoadingScreen } from "../../components/feedback/LoadingScreen";
import { AboutEditor } from "../../components/profile/AboutEditor";
import { CertificationEditor } from "../../components/profile/CertificationEditor";
import { EducationEditor } from "../../components/profile/EducationEditor";
import { ExperienceEditor } from "../../components/profile/ExperienceEditor";
import { IntroductionEditor } from "../../components/profile/IntroductionEditor";
import { ProfileSection } from "../../components/profile/ProfileSection";
import { SkillsEditor } from "../../components/profile/SkillsEditor";
import {
  selectProfile,
  selectProfileError,
  selectProfileFetchStatus,
} from "../../features/profile/profileSelectors";
import {
  addCertification,
  addEducation,
  addExperience,
  deleteCertification,
  deleteEducation,
  deleteExperience,
  fetchMyProfile,
  fetchProfile,
  fetchPublicProfile,
  updateAbout,
  updateCertification,
  updateEducation,
  updateExperience,
  updateIntroduction,
  updateSkills,
} from "../../features/profile/profileThunk";

type EditorState =
  | { type: "introduction" | "about" | "skills" }
  | { type: "education" | "experience" | "certification"; itemId?: string };

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

export default function ProfilePage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector(selectProfile);
  const fetchStatus = useAppSelector(selectProfileFetchStatus);
  const error = useAppSelector(selectProfileError);

  const [editor, setEditor] = useState<EditorState | null>(null);

  const isOwner = id === user?.id;

  useEffect(() => {
    if (id) void dispatch(fetchProfile(id));
  }, [dispatch, id, isOwner]);

  const openEditor = (type: EditorState["type"], itemId?: string) =>
    setEditor(
      type === "introduction" || type === "about" || type === "skills"
        ? { type }
        : { type, itemId },
    );

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
            if (id) void dispatch(fetchProfile(id));
          }}
          className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );

  return (
    <div className="mx-auto max-w-295 pb-10">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0 space-y-5">

          {/* Introduction Section */}
          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_36px_rgba(0,0,0,0.12)]">
            <div className="h-36 bg-[linear-gradient(115deg,#23133e_0%,#341a5a_44%,#123c4e_100%)] sm:h-48">
              <img
                src={
                  profile.introduction.coverImage.url ||
                  "/cover-placeholder-image.jpg"
                }
                alt="cover image"
                className="h-full w-full object-cover opacity-60 mix-blend-screen"
              />
            </div>
            <div className="relative px-5 pb-5 pt-16 sm:pt-24 sm:px-7 sm:pb-7">
              <img
                src={
                  profile.introduction.profilePicture.url ||
                  "/profile-placeholder-image-png.png"
                }
                alt={profile.introduction.firstName}
                className="absolute top-0 left-[5%] size-28 rounded-full border-4 border-surface object-cover shadow-xl sm:size-44 -translate-y-1/2"
              />

              <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
                      {profile.introduction.firstName}{" "}
                      {profile.introduction.lastName}
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
                    onClick={() => openEditor("introduction")}
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

          {/* About Section */}
          <ProfileSection
            title="About"
            onEdit={isOwner ? () => openEditor("about") : undefined}
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

          {/* Skills Section */}
          <ProfileSection
            title="Skills"
            onEdit={isOwner ? () => openEditor("skills") : undefined}
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

          {/* Experience Section */}
          <ProfileSection
            title="Experience"
            eyebrow={`${profile.experience.length} roles`}
            onAdd={isOwner ? () => openEditor("experience") : undefined}
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
                  </div>
                  {isOwner && (
                    <div className="mt-3 flex gap-3 items-start">
                      <button
                        type="button"
                        onClick={() => openEditor("experience", item._id)}
                        className="inline-flex items-center gap-1 p-2 rounded-full hover:bg-surface-hover cursor-pointer text-xs font-semibold text-accent-cyan"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void dispatch(deleteExperience(item._id))
                        }
                        className="inline-flex items-center gap-1 p-2 rounded-full hover:bg-surface-hover cursor-pointer text-xs font-semibold text-error"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </ProfileSection>

          {/* Education Section */}
          <ProfileSection
            title="Education"
            eyebrow={`${profile.education.length} schools`}
            onAdd={isOwner ? () => openEditor("education") : undefined}
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
                </div>
                {isOwner && (
                  <div className="mt-3 flex gap-3 items-start">
                    <button
                      type="button"
                      onClick={() => openEditor("education", item._id)}
                      className="inline-flex items-center gap-1 p-2 rounded-full hover:bg-surface-hover cursor-pointer text-xs font-semibold text-accent-cyan"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void dispatch(deleteEducation(item._id))}
                      className="inline-flex items-center gap-1 p-2 rounded-full hover:bg-surface-hover cursor-pointer text-xs font-semibold text-error"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </article>
            ))}
          </ProfileSection>

          {/* Certifications Section */}
          <ProfileSection
            title="Licenses & certifications"
            onAdd={isOwner ? () => openEditor("certification") : undefined}
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
                </div>
                {isOwner && (
                  <div className="mt-3 flex gap-3 items-start">
                    <button
                      type="button"
                      onClick={() => openEditor("certification", item._id)}
                      className="inline-flex items-center gap-1 p-2 rounded-full hover:bg-surface-hover cursor-pointer text-xs font-semibold text-accent-cyan"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void dispatch(deleteCertification(item._id))
                      }
                      className="inline-flex items-center gap-1 p-2 rounded-full hover:bg-surface-hover cursor-pointer text-xs font-semibold text-error"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
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

      {/* INTRODUCTION EDITOR */}
      {editor?.type === "introduction" && (
        <IntroductionEditor
          profile={profile.introduction}
          open
          onClose={() => setEditor(null)}
          onSave={(input) => void dispatch(updateIntroduction(input))}
        />
      )}

      {/* ABOUT EDITOR */}
      {editor?.type === "about" && (
        <AboutEditor
          value={profile.about}
          open
          onClose={() => setEditor(null)}
          onSave={(input) => void dispatch(updateAbout(input))}
        />
      )}

      {/* SKILLS EDITOR */}
      {editor?.type === "skills" && (
        <SkillsEditor
          value={profile.skills}
          open
          onClose={() => setEditor(null)}
          onSave={(skills) => void dispatch(updateSkills(skills))}
        />
      )}

      {/* EDUCATION EDITOR */}
      {editor?.type === "education" && (
        <EducationEditor
          value={profile.education.find((item) => item._id === editor.itemId)}
          open
          onClose={() => setEditor(null)}
          onSave={(input) => {
            if (editor.itemId) {
              void dispatch(updateEducation({ id: editor.itemId, input }));
            } else {
              void dispatch(addEducation(input));
            }
          }}
        />
      )}

      {/* EXPERIENCE EDITOR */}
      {editor?.type === "experience" && (
        <ExperienceEditor
          value={profile.experience.find((item) => item._id === editor.itemId)}
          open
          onClose={() => setEditor(null)}
          onSave={(input) => {
            if (editor.itemId) {
              void dispatch(updateExperience({ id: editor.itemId, input }));
            } else {
              void dispatch(addExperience(input));
            }
          }}
        />
      )}

      {/* CERTIFICATION EDITOR */}
      {editor?.type === "certification" && (
        <CertificationEditor
          value={profile.certifications.find(
            (item) => item._id === editor.itemId,
          )}
          open
          onClose={() => setEditor(null)}
          onSave={(input) => {
            if (editor.itemId) {
              void dispatch(updateCertification({ id: editor.itemId, input }));
            } else {
              void dispatch(addCertification(input));
            }
          }}
        />
      )}
    </div>
  );
}
