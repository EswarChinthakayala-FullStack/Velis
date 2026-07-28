import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AuthGuard } from '../modules/auth/auth-guard';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PortalLayout } from '../layouts/PortalLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { AppLogo } from '../components/ui/AppLogo';
import { GlassSkeleton } from '../components/ui/GlassSkeleton';

// Lazy-loaded Pages
const LandingPage = lazy(() => import('../pages/Landing/LandingPage'));
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/Auth/ForgotPasswordPage'));

// Protected Admin Dashboard Pages
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const ProjectsPage = lazy(() => import('../pages/Projects/ProjectsPage'));
const ClientsPage = lazy(() => import('../pages/Clients/ClientsPage'));
const TasksPage = lazy(() => import('../pages/Tasks/TasksPage'));
const MilestonesPage = lazy(() => import('../pages/Milestones/MilestonesPage'));
const GithubPage = lazy(() => import('../pages/Github/GithubPage'));
const DocsPage = lazy(() => import('../pages/Docs/DocsPage'));
const FilesPage = lazy(() => import('../pages/Files/FilesPage'));
const TimelinePage = lazy(() => import('../pages/Timeline/TimelinePage'));
const ClientPortalPage = lazy(() => import('../pages/ClientPortal/ClientPortalPage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const PaymentsPage = lazy(() => import('../pages/Payments/PaymentsPage'));
const ChangelogPage = lazy(() => import('../pages/Changelog/ChangelogPage'));
const NotesPage = lazy(() => import('../pages/Notes/NotesPage'));
const DeploymentsPage = lazy(() => import('../pages/Deployments/DeploymentsPage'));
const SharePortalPage = lazy(() => import('../pages/Share/SharePortalPage'));
const ShareLinksPage = lazy(() => import('../pages/ShareLinks/ShareLinksPage'));
const NotificationsPage = lazy(() => import('../pages/Notifications/NotificationsPage'));

// Error Pages
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('../pages/Unauthorized/UnauthorizedPage'));

/**
 * RouteErrorBoundary Component
 * Prevents full-application crashes on unhandled component errors or route failures.
 */
const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const errorMessage = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
    ? error.message
    : 'An unexpected application error occurred';

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full bg-[rgba(17,17,19,0.88)] border border-zinc-800/80 rounded-lg p-8 backdrop-blur-2xl shadow-2xl space-y-5">
        <div className="flex justify-center">
          <AppLogo size={44} showText={false} />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <span>Route Exception</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Something went wrong</h2>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">{errorMessage}</p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => window.location.assign('/app/dashboard')}
            className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// Suspense Loader Wrapper
const withSuspense = (Component: React.LazyExoticComponent<React.FC>) => (
  <Suspense
    fallback={
      <div className="w-full h-full p-6 flex flex-col justify-center items-center select-none">
        <GlassSkeleton className="w-full h-64 rounded-xl" />
      </div>
    }
  >
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // 1. Public Marketing Landing Route with Header Topbar Layout
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/', element: withSuspense(LandingPage) },
      { path: '/landing', element: withSuspense(LandingPage) },
    ],
  },

  // 2. Authentication Routes
  {
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/login', element: withSuspense(LoginPage) },
      { path: '/forgot-password', element: withSuspense(ForgotPasswordPage) },
      { path: '/reset-password', element: withSuspense(ForgotPasswordPage) },
    ],
  },

  // 3. Public Client Share Portal Route
  {
    element: <PortalLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/share/:token', element: withSuspense(SharePortalPage) },
      { path: '/share/:token/*', element: withSuspense(SharePortalPage) },
    ],
  },

  // 4. Protected Enterprise Admin Dashboard Routes (/app/*)
  {
    path: '/app',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </AuthGuard>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: withSuspense(DashboardPage) },
      { path: 'projects', element: withSuspense(ProjectsPage) },
      { path: 'projects/:projectId', element: withSuspense(ProjectsPage) },
      { path: 'clients', element: withSuspense(ClientsPage) },
      { path: 'clients/:clientId', element: withSuspense(ClientsPage) },
      { path: 'timeline', element: withSuspense(TimelinePage) },
      { path: 'milestones', element: withSuspense(MilestonesPage) },
      { path: 'tasks', element: withSuspense(TasksPage) },
      { path: 'github', element: withSuspense(GithubPage) },
      { path: 'repositories', element: withSuspense(GithubPage) },
      { path: 'files', element: withSuspense(FilesPage) },
      { path: 'documents', element: withSuspense(DocsPage) },
      { path: 'docs', element: withSuspense(DocsPage) },
      { path: 'client-portal', element: withSuspense(ClientPortalPage) },
      { path: 'portals', element: withSuspense(ClientPortalPage) },
      { path: 'share-links', element: withSuspense(ShareLinksPage) },
      { path: 'payments', element: withSuspense(PaymentsPage) },
      { path: 'finances', element: withSuspense(PaymentsPage) },
      { path: 'changelog', element: withSuspense(ChangelogPage) },
      { path: 'releases', element: withSuspense(ChangelogPage) },
      { path: 'notes', element: withSuspense(NotesPage) },
      { path: 'deployments', element: withSuspense(DeploymentsPage) },
      { path: 'environments', element: withSuspense(DeploymentsPage) },
      { path: 'activity', element: withSuspense(DashboardPage) },
      { path: 'notifications', element: withSuspense(NotificationsPage) },
      { path: 'analytics', element: withSuspense(DashboardPage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: 'profile', element: withSuspense(SettingsPage) },
    ],
  },

  // 5. Error & Fallback Routes
  { path: '/403', element: withSuspense(UnauthorizedPage) },
  { path: '/404', element: withSuspense(NotFoundPage) },
  { path: '*', element: withSuspense(NotFoundPage) },
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;

export default router;
