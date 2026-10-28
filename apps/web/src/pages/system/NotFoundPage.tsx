import { Link } from "react-router-dom";
export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1160px] flex-col items-start justify-center px-6 py-20 lg:px-8">
      <span className="text-7xl font-extrabold tracking-[-0.06em] text-primary">
        404
      </span>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
        Looks like you're off the map.
      </h1>
      <p className="mt-4 text-base text-text-secondary">
        We couldn't find the page you're looking for.
      </p>
      <Link
        className="mt-8 rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
        to="/"
      >
        Back to DevHub
      </Link>
    </section>
  );
}
