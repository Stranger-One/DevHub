import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { UserRole } from "../types/auth.types";
import { useAppSelector } from "../app/hooks";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);


  if (!isAuthenticated || !user) {
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
