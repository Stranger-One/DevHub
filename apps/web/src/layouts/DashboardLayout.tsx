import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

export function DashboardLayout() {
  const user = useAppSelector((state) => state.auth.user);
  const base = user?.role === "developer" ? "/developer" : "/client";
  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface px-5 py-6 md:flex md:flex-col">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-[-0.03em]"
        >
          <span className="grid size-8 place-items-center rounded-[10px] bg-primary text-sm font-extrabold text-white">
            D
          </span>{" "}
          devhub
        </Link>
        <p className="mb-3 mt-10 text-[0.6875rem] font-bold tracking-[0.16em] text-text-muted">
          WORKSPACE
        </p>
        <nav className="flex flex-col gap-1 text-sm text-text-muted">
          <NavLink
            className="rounded-lg px-3 py-2 hover:bg-surface-hover hover:text-text-primary"
            to={`${base}/dashboard`}
          >
            Overview
          </NavLink>
          <NavLink
            className="rounded-lg px-3 py-2 hover:bg-surface-hover hover:text-text-primary"
            to={`${base}/projects`}
          >
            Projects
          </NavLink>
          <NavLink
            className="rounded-lg px-3 py-2 hover:bg-surface-hover hover:text-text-primary"
            to={`${base}/jobs`}
          >
            Jobs
          </NavLink>
          <NavLink
            className="rounded-lg px-3 py-2 hover:bg-surface-hover hover:text-text-primary"
            to="/messages"
          >
            Messages
          </NavLink>
          <NavLink
            className="rounded-lg px-3 py-2 hover:bg-surface-hover hover:text-text-primary"
            to="/notifications"
          >
            Notifications
          </NavLink>
          <NavLink
            className="rounded-lg px-3 py-2 hover:bg-surface-hover hover:text-text-primary"
            to="/settings"
          >
            Settings
          </NavLink>
        </nav>
        <div className="mt-auto flex items-center gap-3 border-t border-border pt-5">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-accent-purple">
            {user?.username?.slice(0, 1).toUpperCase() ?? "U"}
          </div>
          <div>
            <strong className="block text-sm">
              {user?.profile?.displayName ?? user?.username ?? "Your account"}
            </strong>
            <span className="text-xs capitalize text-text-muted">
              {user?.role ?? "Member"}
            </span>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
