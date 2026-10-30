import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { UserRole } from "../types/auth.types";
import { LoadingScreen } from "../components/feedback/LoadingScreen";
import { useAppSelector } from "../app/hooks";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, status } = useAppSelector((state) => state.auth);

  if (status === "checking") return <LoadingScreen label="Checking access…" />;
  if (status !== "authenticated" || !user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={
          user.role === "developer"
            ? "/developer/dashboard"
            : "/client/dashboard"
        }
        replace
      />
    );
  }

  return <Outlet />;
}
