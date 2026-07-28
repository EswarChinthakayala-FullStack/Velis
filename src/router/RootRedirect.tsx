import React from 'react';
import { Navigate } from 'react-router-dom';

interface RootRedirectProps {
  isAuthenticated: boolean;
}

export const RootRedirect: React.FC<RootRedirectProps> = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Navigate to="/landing" replace />;
};

export default RootRedirect;
