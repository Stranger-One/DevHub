import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { HomePage } from "../pages/public/HomePage";
import { PlaceholderPage } from "../pages/public/PlaceholderPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import VarifyEmailPage from "../pages/auth/VarifyEmailPage";
import { OnboardingPage } from "../pages/shared/OnboardingPage";
import { SettingsPage } from "../pages/shared/SettingsPage";
import { MessagesPage } from "../pages/shared/MessagesPage";
import { NotificationsPage } from "../pages/shared/NotificationsPage";
import { DeveloperRoutes } from "../pages/developer/DeveloperRoutes";
import { ClientRoutes } from "../pages/client/ClientRoutes";
import { NotFoundPage } from "../pages/system/NotFoundPage";
import { useEffect, useState, type ReactNode } from "react";
import { GuestRoute } from "../routes/GuestRoute";
import { Toaster } from "sonner";
import { useAppDispatch } from "./hooks";
import { LoadingScreen } from "../components/feedback/LoadingScreen";
import { fetchCurrentUser } from "../features/auth/authThunk";

function Page({ title }: { title: string }) {
  return <PlaceholderPage title={title} />;
}
function MessagesRoutes() {
  return (
    <Routes>
      <Route index element={<MessagesPage />} />
      <Route path=":conversationId" element={<MessagesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
function SettingsRoutes() {
  return (
    <Routes>
      <Route index element={<SettingsPage />} />
      <Route path="profile" element={<Page title="Profile settings" />} />
      <Route path="security" element={<Page title="Security settings" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
function StaticPublicPage({ title }: { title: string }) {
  return <Page title={title} />;
}
function PublicPage({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function AppRouter() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const pageLoading = async () => {
    try {
      await dispatch(fetchCurrentUser());
      console.log("fetchCurrentUser called");
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pageLoading();
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/explore"
            element={<StaticPublicPage title="Explore DevHub" />}
          />
          <Route
            path="/developers"
            element={<StaticPublicPage title="Discover developers" />}
          />
          <Route
            path="/developers/:username"
            element={<StaticPublicPage title="Developer profile" />}
          />
          <Route
            path="/projects"
            element={<StaticPublicPage title="Projects" />}
          />
          <Route
            path="/projects/:projectId"
            element={<StaticPublicPage title="Project details" />}
          />
          <Route
            path="/jobs"
            element={<StaticPublicPage title="Freelance jobs" />}
          />
          <Route
            path="/jobs/:jobId"
            element={<StaticPublicPage title="Job details" />}
          />
          <Route
            path="/community"
            element={<StaticPublicPage title="Community" />}
          />
          <Route
            path="/community/:postId"
            element={<StaticPublicPage title="Community post" />}
          />
          <Route
            path="/articles"
            element={<StaticPublicPage title="Articles and tutorials" />}
          />
          <Route
            path="/articles/:slug"
            element={<StaticPublicPage title="Article" />}
          />
          <Route
            path="/terms"
            element={<StaticPublicPage title="Terms and conditions" />}
          />
          <Route
            path="/privacy"
            element={<StaticPublicPage title="Privacy policy" />}
          />
        </Route>

        {/* Guest-only pages */}
        <Route element={<GuestRoute />}>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="verify-email/:id" element={<VarifyEmailPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>
        </Route>

        {/* Any authenticated user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/settings/*" element={<SettingsRoutes />} />
          <Route path="/messages/*" element={<MessagesRoutes />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Developer-only */}
        <Route element={<ProtectedRoute allowedRoles={["developer"]} />}>
          <Route path="/developer/*" element={<DeveloperRoutes />} />
        </Route>

        {/* Client-only */}
        <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
          <Route path="/client/*" element={<ClientRoutes />} />
        </Route>

        <Route
          path="*"
          element={
            <PublicPage>
              <NotFoundPage />
            </PublicPage>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
