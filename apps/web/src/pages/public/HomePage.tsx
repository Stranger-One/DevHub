import { Link } from "react-router-dom";

const highlights = [
  {
    number: "01",
    title: "Find your people",
    text: "Meet developers and clients who are excited to make useful things together.",
  },
  {
    number: "02",
    title: "Build in public",
    text: "Showcase projects, share progress, and learn from a community of builders.",
  },
  {
    number: "03",
    title: "Turn ideas into work",
    text: "Organize projects, collaborate with a team, and discover freelance opportunities.",
  },
];

export function HomePage() {
  return (
    <div className="overflow-hidden bg-background text-text-primary">
      <section className="relative mx-auto grid max-w-[1160px] gap-16 px-6 pb-20 pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-24 before:absolute before:inset-x-0 before:top-0 before:-z-0 before:h-[480px] before:bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,40,190,0.2),transparent_65%)] before:content-['']">
        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.16em] text-accent-purple">
            <span className="size-2 rounded-full bg-accent-emerald shadow-[0_0_12px_rgba(0,214,160,0.7)]" />{" "}
            THE COMMUNITY FOR BUILDERS
          </div>
          <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.06] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            Good things happen when{" "}
            <span className="bg-[linear-gradient(100deg,#b59aff_0%,#e879f9_48%,#69c9ff_100%)] bg-clip-text text-transparent">
              developers connect.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-text-secondary">
            A home for developers and clients to share ideas, build projects,
            find collaborators, and turn great work into real opportunities.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="rounded-[10px] bg-primary px-5 py-3.5 text-center text-sm font-semibold text-white shadow-[0_0_28px_rgba(145,75,255,0.25)] hover:bg-primary-hover"
              to="/register"
            >
              Join DevHub <span aria-hidden="true">↗</span>
            </Link>
            <Link
              className="rounded-[10px] border border-border px-5 py-3.5 text-center text-sm font-semibold text-text-secondary hover:border-border-strong hover:bg-surface-hover hover:text-text-primary"
              to="/explore"
            >
              Explore the community
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["D", "R", "A", "+"].map((letter) => (
                <span
                  className="grid size-8 place-items-center rounded-full border-2 border-background bg-primary-soft text-xs font-bold text-accent-purple"
                  key={letter}
                >
                  {letter}
                </span>
              ))}
            </div>
            <p className="text-sm">
              <strong>Made for people who build.</strong>
              <br />
              <span className="text-text-muted">
                Your next idea starts with a conversation.
              </span>
            </p>
          </div>
        </div>
        <div
          className="relative min-h-[360px]"
          aria-label="Illustration of connected project cards"
        >
          <div className="absolute inset-8 rounded-full border border-border-strong/60 [transform:rotate(-18deg)]" />
          <div className="absolute inset-16 rounded-full border border-accent-purple/20 [transform:rotate(22deg)]" />
          <div className="absolute left-2 top-10 w-64 rounded-[14px] border border-border-strong bg-surface p-5 shadow-2xl sm:left-10">
            <span className="text-[0.625rem] font-bold tracking-[0.14em] text-text-muted">
              CURRENTLY BUILDING
            </span>
            <div className="mt-5 space-y-2">
              <i className="block h-2 w-3/4 rounded bg-accent-purple/70" />
              <i className="block h-2 w-1/2 rounded bg-accent-pink/50" />
              <i className="block h-2 w-2/3 rounded bg-accent-cyan/50" />
              <i className="block h-2 w-1/3 rounded bg-text-muted/40" />
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-text-secondary">
              <span className="size-2 rounded-full bg-accent-emerald" /> Project
              workspace{" "}
              <span className="ml-auto rounded-full bg-accent-emerald/10 px-2 py-0.5 text-[0.625rem] text-accent-emerald">
                Live
              </span>
            </div>
          </div>
          <div className="absolute right-0 top-36 flex w-56 flex-col gap-3 rounded-[14px] border border-border bg-surface-raised p-5 shadow-2xl sm:right-6">
            <div className="grid size-9 place-items-center rounded-lg bg-primary-soft text-xl text-accent-purple">
              ✳
            </div>
            <strong className="text-sm">Ideas become better together.</strong>
            <span className="text-xs text-text-muted">
              Share · Build · Grow
            </span>
          </div>
          <div className="absolute bottom-0 left-10 flex w-64 items-center gap-3 rounded-[14px] border border-border bg-surface p-4 shadow-2xl sm:left-20">
            <div className="flex -space-x-2">
              <span className="grid size-7 place-items-center rounded-full border-2 border-surface bg-accent-cyan text-[0.625rem] font-bold text-background">
                R
              </span>
              <span className="grid size-7 place-items-center rounded-full border-2 border-surface bg-accent-pink text-[0.625rem] font-bold text-background">
                M
              </span>
              <span className="grid size-7 place-items-center rounded-full border-2 border-surface bg-accent-emerald text-[0.625rem] font-bold text-background">
                K
              </span>
            </div>
            <div>
              <strong className="text-sm">Community</strong>
              <p className="text-xs text-text-muted">
                A little help goes a long way.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-border bg-surface">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-3 px-6 py-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>ONE SPACE FOR YOUR NEXT CHAPTER</span>
          <span className="text-sm text-text-secondary">
            Discover <b>·</b> Collaborate <b>·</b> Launch <b>·</b> Grow
          </span>
        </div>
      </section>
      <section className="mx-auto max-w-[1160px] px-6 py-20 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[0.6875rem] font-bold tracking-[0.16em] text-accent-purple">
              WHY DEVHUB
            </span>
            <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              From first idea to finished project.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-text-secondary">
            The people, projects, and opportunities that help you move forward.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              className="group relative rounded-[14px] border border-border bg-surface p-6 hover:border-border-strong hover:bg-surface-hover"
              key={item.number}
            >
              <span className="text-xs font-bold text-accent-purple">
                {item.number}
              </span>
              <h3 className="mt-8 text-lg font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {item.text}
              </p>
              <span
                className="mt-8 block text-lg text-text-muted transition group-hover:translate-x-1 group-hover:text-accent-purple"
                aria-hidden="true"
              >
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>
      <section className="px-6 pb-20 lg:px-8 lg:pb-28">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-8 rounded-[18px] border border-border-strong bg-[linear-gradient(110deg,#161026,#0d0f14_62%,#0d171c)] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-[0.6875rem] font-bold tracking-[0.16em] text-accent-purple">
              YOUR NEXT CHAPTER STARTS HERE
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em]">
              Have an idea? Find your people.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">
              Build your profile, discover projects, and meet the people who can
              help you make it happen.
            </p>
          </div>
          <Link
            to="/register"
            className="shrink-0 rounded-[10px] bg-white px-5 py-3.5 text-center text-sm font-semibold text-background hover:bg-text-primary"
          >
            Get started <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
