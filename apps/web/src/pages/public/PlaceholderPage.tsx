import { Link } from "react-router-dom";

export function PlaceholderPage({
  title,
  description = "This page is part of the DevHub starter and will be implemented in its feature phase.",
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1160px] flex-col items-start justify-center px-6 py-20 lg:px-8">
      <span className="mb-4 text-[0.6875rem] font-bold tracking-[0.16em] text-accent-purple">
        DEVHUB WORKSPACE
      </span>
      <h1 className="max-w-2xl text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
        {description}
      </p>
      <Link
        className="mt-8 rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
        to="/"
      >
        Back to home
      </Link>
    </section>
  );
}
