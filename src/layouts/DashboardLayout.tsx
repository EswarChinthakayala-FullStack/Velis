import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminShell } from '../components/layout/admin-shell';
import type { ViewMode, NotificationItem } from '../types';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  currentView?: ViewMode;
  onSelectView?: (view: ViewMode) => void;
  onOpenCreateProject?: () => void;
  notifications?: NotificationItem[];
  onLogout?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  onOpenCreateProject,
}) => {
  return (
    <AdminShell onOpenCreateProject={onOpenCreateProject}>
      {children || <Outlet />}
    </AdminShell>
  );
};

export default DashboardLayout;
