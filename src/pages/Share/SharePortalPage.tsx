import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PortalShell } from '../../modules/portal/portal-shell';

export const SharePortalPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <PortalShell token={token} />;
};

export default SharePortalPage;
