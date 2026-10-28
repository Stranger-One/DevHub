import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { PlaceholderPage } from "../public/PlaceholderPage";
import { NotFoundPage } from "../system/NotFoundPage";

export function ClientRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route
          path="dashboard"
          element={
            <PlaceholderPage
              title="Client dashboard"
              description="Manage your projects, jobs, applicants, and active contracts."
            />
          }
        />
        <Route
          path="projects"
          element={<PlaceholderPage title="My projects" />}
        />
        <Route
          path="projects/new"
          element={<PlaceholderPage title="Create a project" />}
        />
        <Route path="jobs" element={<PlaceholderPage title="My jobs" />} />
        <Route
          path="jobs/new"
          element={<PlaceholderPage title="Post a job" />}
        />
        <Route
          path="developers"
          element={<PlaceholderPage title="Find developers" />}
        />
        <Route
          path="contracts"
          element={<PlaceholderPage title="My contracts" />}
        />
        <Route
          path="payments"
          element={<PlaceholderPage title="Payments and billing" />}
        />
        <Route index element={<PlaceholderPage title="Client workspace" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
