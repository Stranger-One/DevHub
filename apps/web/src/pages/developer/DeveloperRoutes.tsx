import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { PlaceholderPage } from "../public/PlaceholderPage";
import { NotFoundPage } from "../system/NotFoundPage";

export function DeveloperRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route
          path="dashboard"
          element={
            <PlaceholderPage
              title="Developer dashboard"
              description="Your projects, tasks, applications, and recent activity in one place."
            />
          }
        />
        <Route
          path="portfolio/edit"
          element={<PlaceholderPage title="Edit portfolio" />}
        />
        <Route
          path="projects"
          element={<PlaceholderPage title="My projects" />}
        />
        <Route path="tasks" element={<PlaceholderPage title="My tasks" />} />
        <Route
          path="jobs"
          element={<PlaceholderPage title="Discover jobs" />}
        />
        <Route
          path="applications"
          element={<PlaceholderPage title="My applications" />}
        />
        <Route
          path="contracts"
          element={<PlaceholderPage title="My contracts" />}
        />
        <Route
          path="payments"
          element={<PlaceholderPage title="My earnings" />}
        />
        <Route
          index
          element={<PlaceholderPage title="Developer workspace" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
