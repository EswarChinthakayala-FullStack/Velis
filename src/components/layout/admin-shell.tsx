import React, { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { authService } from '../../modules/auth/auth-service';
import type { ViewMode } from '../../types';
import { INITIAL_NOTIFICATIONS } from '../../data/mockData';
import { useAppearanceSettings } from '../../modules/settings/hooks/useSettings';

interface AdminShellProps {
  children?: React.ReactNode;
  onOpenCreateProject?: () => void;
}

/**
 * AdminShell Component (PHASE 04)
 * Enterprise Administrator Layout Shell for Velis using the AppSidebar (sidebar-07) navigation system.
 */
export const AdminShell: React.FC<AdminShellProps> = ({
  children,
  onOpenCreateProject,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: appearance } = useAppearanceSettings();

  useEffect(() => {
    if (appearance) {
      if (appearance.compactMode) {
        document.documentElement.classList.add('compact-mode');
      } else {
        document.documentElement.classList.remove('compact-mode');
      }

      if (appearance.reducedMotion) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
    }
  }, [appearance]);

  // Derive current view mode from route path
  const pathSegment = location.pathname.split('/').pop() || 'dashboard';
  const currentView: ViewMode =
    pathSegment === 'client-portal' ? 'client_portal' : (pathSegment as ViewMode);

  const handleSelectView = (view: ViewMode) => {
    const targetRoute = view === 'client_portal' ? 'client-portal' : view;
    navigate(`/app/${targetRoute}`);
  };

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <AppLayout
      currentView={currentView}
      onSelectView={handleSelectView}
      onOpenCreateProject={onOpenCreateProject ?? (() => navigate('/app/projects'))}
      notifications={INITIAL_NOTIFICATIONS}
      onLogout={handleLogout}
    >
      {children ?? <Outlet />}
    </AppLayout>
  );
};

export default AdminShell;
