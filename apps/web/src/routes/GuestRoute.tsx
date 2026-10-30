import { Navigate, Outlet } from "react-router-dom";
import { LoadingScreen } from "../../components/feedback/LoadingScreen";
import { useAppSelector } from "../../app/hooks";

export function GuestRoute() {
  const { user, status } = useAppSelector((state) => state.auth);

  if (status === "checking")
    return <LoadingScreen label="Checking your session…" />;
  if (status === "authenticated" && user) {
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
