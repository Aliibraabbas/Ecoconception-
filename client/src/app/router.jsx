import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout.jsx";
import { AuthLayout } from "@/layouts/AuthLayout.jsx";
import { AppLayout } from "@/layouts/AppLayout.jsx";
import { RequireAuth } from "./RequireAuth.jsx";

const Landing = lazy(() => import("@/pages/Landing/index.jsx"));
const Auth = lazy(() => import("@/pages/Auth/index.jsx"));
const ResetPassword = lazy(() => import("@/pages/Auth/ResetPassword.jsx"));
const Dashboard = lazy(() => import("@/pages/Dashboard/index.jsx"));
const Projects = lazy(() => import("@/pages/Projects/index.jsx"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail/index.jsx"));
const CalendarPage = lazy(() => import("@/pages/Calendar/index.jsx"));
const Profile = lazy(() => import("@/pages/Profile/index.jsx"));
const Settings = lazy(() => import("@/pages/Settings/index.jsx"));
const NotFound = lazy(() => import("@/pages/NotFound/index.jsx"));

function PageFallback() {
  return <div className="flex min-h-[50vh] items-center justify-center text-text-secondary">Chargement…</div>;
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/reset" element={<ResetPassword />} />
        </Route>

        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/projects" element={<Projects />} />
          <Route path="/app/projects/:id" element={<ProjectDetail />} />
          <Route path="/app/calendar" element={<CalendarPage />} />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="/app/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
