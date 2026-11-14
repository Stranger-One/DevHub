import { useState, type MouseEvent } from "react";
import {
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  ChevronsLeft,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Sparkles,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSidebarPinned } from "../app/uiSlice";
import { logoutUser } from "../features/auth/authThunk";
import { toast } from "sonner";

type NavigationItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export function DashboardLayout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const base = user?.role === "developer" ? "/developer" : "/client";
  const isPinned = useAppSelector((state) => state.ui.isSidebarPinned);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isExpanded = isPinned;

  const navigation: NavigationItem[] = [
    { label: "Overview", to: `${base}/dashboard`, icon: LayoutDashboard },
    { label: "Projects", to: `${base}/projects`, icon: FolderKanban },
    { label: "Jobs", to: `${base}/jobs`, icon: BriefcaseBusiness },
    { label: "Messages", to: "/messages", icon: MessageCircle },
    { label: "Notifications", to: "/notifications", icon: Bell },
    { label: "Settings", to: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      toast.success("Logged out successfully");
    }
  };

  const closeMobileMenu = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.currentTarget) setIsMobileOpen(false);
  };

  const handleMobileLogout = async () => {
    setIsMobileOpen(false);
    await handleLogout();
  };

  const renderNavigation = (mobile = false) => (
    <nav className="flex flex-col gap-1.5" aria-label="Workspace navigation">
      {navigation.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={label}
          to={to}
          onClick={mobile ? closeMobileMenu : undefined}
          className={({ isActive }) =>
            `group relative flex items-center gap-3 overflow-hidden p-3 text-sm font-medium transition-all ease-in-out duration-500 ${
              isActive
                ? "bg-primary-soft text-text-primary shadow-[inset_3px_0_0_var(--color-primary),0_8px_24px_rgba(145,75,255,0.12)]"
                : "text-text-muted hover:translate-x-1 hover:bg-surface-hover hover:text-text-primary"
            } ${mobile ? "w-full" : ""}`
          }
          title={!mobile && !isExpanded ? label : undefined}
        >
          <span className="relative grid size-6 shrink-0 place-items-center transition-transform ease-in-out duration-500 group-hover:scale-110 group-hover:-rotate-6">
            <Icon size={20} strokeWidth={1.8} />
          </span>
          <span
            className={`whitespace-nowrap transition-all duration-300 ${
              mobile || isExpanded
                ? "translate-x-0 opacity-100"
                : "-translate-x-2 opacity-0"
            }`}
          >
            {label}
          </span>
          <ChevronRight
            size={15}
            className={`ml-auto shrink-0 transition-all duration-500 ${
              mobile || isExpanded
                ? "translate-x-0 opacity-40"
                : "-translate-x-3 opacity-0"
            }`}
          />
        </NavLink>
      ))}
    </nav>
  );

  const renderProfile = (mobile = false) => (
    <div className={`border-t border-border pt-4 mt-4`}>
      <button
        type="button"
        onClick={mobile ? handleMobileLogout : handleLogout}
        className="relative my-3 flex items-center w-full cursor-pointer hover:translate-x-1 hover:bg-surface-hover hover:text-text-primary "
      >
        <span className="p-3 shrink-0">
          <LogOut size={20} strokeWidth={1.8} className="" />
        </span>
        <span
          className={`transition-all duration-300 whitespace-nowrap ${mobile || isExpanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
        >
          Log out
        </span>
      </button>

      <Link
        to={`/profile/${user?.id}`}
        className={`relative my-3 flex items-center w-full cursor-pointer hover:translate-x-1 hover:bg-surface-hover hover:text-text-primary `}
      >
        <span className="p-3 shrink-0">
          <User size={20} strokeWidth={1.8} />
        </span>
        <div
          className={`transition-all duration-300 whitespace-nowrap ${mobile || isExpanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
        >
          <p className="block truncate text-sm font-bold">
            {user?.username ?? "Your account"}
          </p>
          <p className="text-xs capitalize text-text-muted">
            {user?.role ?? "Member"}
          </p>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="grid size-8 place-items-center rounded-[10px] bg-primary text-sm font-extrabold text-white ">
            D
          </span>
          DevHub
        </Link>
        <button
          aria-label="Open workspace navigation"
          className="grid size-10 cursor-pointer place-items-center rounded-xl border border-border text-text-secondary hover:border-border-strong hover:bg-surface-hover hover:text-text-primary"
          onClick={() => setIsMobileOpen(true)}
          type="button"
        >
          <Menu size={20} />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[min(19rem,88vw)] flex-col overflow-y-auto border-r border-border bg-surface px-4 py-10 shadow-2xl transition-all duration-300 ease-in-out md:w-20 md:translate-x-0 md:overflow-hidden md:px-3 md:shadow-none ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} ${isExpanded ? "md:w-64 md:px-5" : ""}`}
        onMouseEnter={() => dispatch(setSidebarPinned(true))}
        // onMouseLeave={() => dispatch(setSidebarPinned(false))}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className={`relative flex items-center gap-3 overflow-hidden px-3 text-sm font-medium transition-all ease-in-out duration-500`}
          >
            <span className="relative grid size-9 rounded-xl shrink-0 place-items-center transition-transform ease-in-out duration-500 bg-primary text-sm font-extrabold text-white ">
              D
            </span>
            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                isExpanded
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-2 opacity-0"
              }`}
            >
              DevHub
            </span>
          </Link>
        </div>

        <button
          aria-label="Close workspace navigation"
          className="absolute right-5 top-5 grid size-9 cursor-pointer place-items-center rounded-xl text-text-muted hover:bg-surface-hover hover:text-text-primary md:hidden"
          onClick={() => setIsMobileOpen(false)}
          type="button"
        >
          <X size={18} />
        </button>

        <button
          aria-label="Close workspace navigation"
          className={`absolute right-5 top-10 size-9 transition-all duration-500 ease-in-out cursor-pointer place-items-center rounded-xl text-text-muted hover:bg-surface-hover hover:text-text-primary hidden md:grid ${isExpanded ? "opacity-100 block" : "opacity-0 hidden"}`}
          onClick={() => dispatch(setSidebarPinned(false))}
          type="button"
        >
          <ChevronsLeft size={20} />
        </button>

        <div
          className={`relative mb-3 mt-10 flex items-center gap-3 overflow-hidden px-3 text-sm font-medium transition-all ease-in-out duration-500`}
        >
          <span className="relative grid size-9 rounded-xl shrink-0 place-items-center text-sm font-extrabold text-white ">
            <Sparkles size={20} className="shrink-0 text-accent-cyan" />
          </span>
          <span
            className={`whitespace-nowrap transition-all duration-300 text-[0.6875rem] font-bold tracking-[0.16em] text-text-muted ${
              isExpanded
                ? "translate-x-0 opacity-100"
                : "-translate-x-2 opacity-0"
            }`}
          >
            WORKSPACE
          </span>
        </div>

        <div className="flex flex-col justify-between w-full h-full">
          <div className="hidden md:block">{renderNavigation()}</div>
          <div className="hidden md:block">{renderProfile()}</div>

          <div className="md:hidden">
            {renderNavigation(true)}
            {renderProfile(true)}
          </div>
        </div>
      </aside>

      <main
        className={`h-screen transition-all duration-300 ease-in-out w-full overflow-y-auto px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-20 md:py-6 md:pr-6 md:pl-20 lg:py-10 lg:pr-10 ${isExpanded ? "md:pl-64" : ""}`}
      >
        <Outlet />
      </main>
    </div>
  );
}
