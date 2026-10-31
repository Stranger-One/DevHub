import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";  

export function GuestRoute() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);


  if (isAuthenticated && user) {
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
