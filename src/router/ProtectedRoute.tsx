import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from '../modules/auth/auth-guard';

interface ProtectedRouteProps {
  isAuthenticated?: boolean;
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/login'
}) => {
  return (
    <AuthGuard redirectTo={redirectPath}>
      <Outlet />
    </AuthGuard>
  );
};

export default ProtectedRoute;
