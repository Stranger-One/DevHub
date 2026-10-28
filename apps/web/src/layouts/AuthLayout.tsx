import { Link, Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-12 text-text-primary before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_50%_0%,rgba(112,40,190,0.2),transparent_42%)] before:content-['']">
      <Link
        to="/"
        className="relative mb-8 flex items-center gap-2 text-lg font-bold tracking-[-0.03em]"
      >
        <span className="grid size-8 place-items-center rounded-[10px] bg-primary text-sm font-extrabold text-white">
          D
        </span>{" "}
        devhub
      </Link>
      <section className="relative w-full max-w-[460px] rounded-[18px] border border-border bg-surface p-6 shadow-[0_20px_80px_rgba(0,0,0,0.3)] sm:p-8">
        <Outlet />
      </section>
      <p className="relative mt-6 text-sm text-text-muted">
        A place to build, collaborate, and grow.
      </p>
    </div>
  );
}
