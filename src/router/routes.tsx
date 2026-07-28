import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { RouteLoading } from './RouteLoading';
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PortalLayout } from '../layouts/PortalLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import type { ViewMode } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

// Lazy Loaded Pages (Code Splitting)
const LandingPage = lazy(() => import('../pages/Landing/LandingPage'));
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const ProjectsPage = lazy(() => import('../pages/Projects/ProjectsPage'));
const GithubPage = lazy(() => import('../pages/Github/GithubPage'));
const DocsPage = lazy(() => import('../pages/Docs/DocsPage'));
const FilesPage = lazy(() => import('../pages/Files/FilesPage'));
const TimelinePage = lazy(() => import('../pages/Timeline/TimelinePage'));
const ClientPortalPage = lazy(() => import('../pages/ClientPortal/ClientPortalPage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const PaymentsPage = lazy(() => import('../pages/Payments/PaymentsPage'));
const SharePortalPage = lazy(() => import('../pages/Share/SharePortalPage'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('../pages/Unauthorized/UnauthorizedPage'));

interface AppRoutesProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  setIsCreateProjectOpen: (val: boolean) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  isAuthenticated,
  setIsAuthenticated,
  currentView,
  setCurrentView,
  setIsCreateProjectOpen
}) => {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        {/* Public Marketing Landing Page at "/" and "/landing" */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
        </Route>

        {/* Auth Route */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Client Share Link Route */}
        <Route element={<PortalLayout />}>
          <Route path="/share/:token" element={<SharePortalPage />} />
        </Route>

        {/* Authenticated Protected Admin Dashboard Routes */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route
            path="/app/*"
            element={
              <DashboardLayout
                currentView={currentView}
                onSelectView={(view) => setCurrentView(view)}
                onOpenCreateProject={() => setIsCreateProjectOpen(true)}
                notifications={INITIAL_NOTIFICATIONS}
                onLogout={() => {
                  setIsAuthenticated(false);
                  navigate('/');
                }}
              />
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="github" element={<GithubPage />} />
            <Route path="docs" element={<DocsPage />} />
            <Route path="files" element={<FilesPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="client-portal" element={<ClientPortalPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Error Pages */}
        <Route path="/403" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
