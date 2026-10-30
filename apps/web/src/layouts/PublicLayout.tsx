import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export function PublicLayout() {
  const { user, status } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <header className="w-full z-40 sticky top-0 bg-background text-text-primary">
        <div className="mx-auto max-w-330 flex items-center justify-between gap-6 px-6 py-6 lg:px-8 ">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-[-0.03em]"
            aria-label="DevHub home"
          >
            <span className="grid size-8 place-items-center rounded-[10px] bg-primary text-sm font-extrabold text-white shadow-[0_0_24px_rgba(145,75,255,0.28)]">
              D
            </span>{" "}
            devhub
          </Link>
          <nav
            className="hidden items-center gap-6 text-sm text-text-muted lg:flex"
            aria-label="Main navigation"
          >
            <NavLink className="hover:text-text-primary" to="/explore">
              Explore
            </NavLink>
            <NavLink className="hover:text-text-primary" to="/developers">
              Developers
            </NavLink>
            <NavLink className="hover:text-text-primary" to="/projects">
              Projects
            </NavLink>
            <NavLink className="hover:text-text-primary" to="/jobs">
              Jobs
            </NavLink>
            <NavLink className="hover:text-text-primary" to="/community">
              Community
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            {status === "authenticated" && user ? (
              <Link
                className="rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
                to={
                  user.role === "developer"
                    ? "/developer/dashboard"
                    : "/client/dashboard"
                }
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  className="rounded-[10px] border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary hover:border-border-strong hover:bg-surface-hover hover:text-text-primary"
                  to="/auth/login"
                >
                  Log in
                </Link>
                <Link
                  className="rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
                  to="/auth/register"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mx-auto flex max-w-[1160px] flex-col gap-3 border-t border-border px-6 py-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span>© {new Date().getFullYear()} DevHub</span>
        <span>Build together. Grow together.</span>
        <div className="flex gap-4">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
