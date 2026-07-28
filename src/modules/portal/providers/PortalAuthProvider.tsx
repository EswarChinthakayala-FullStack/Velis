import React from 'react';
import { PortalContext } from '../context/PortalContext';
import { usePortalProject } from '../hooks/usePortalProject';
import type { SupabaseClient } from '@supabase/supabase-js';

interface PortalAuthProviderProps {
  children: React.ReactNode;
  viewerJwt: string;
  projectId: string;
  viewerClient: SupabaseClient;
  onClearSession: () => void;
}

export const PortalAuthProvider: React.FC<PortalAuthProviderProps> = ({
  children,
  viewerJwt,
  projectId,
  viewerClient,
  onClearSession,
}) => {
  const { data: project = null, isLoading: isLoadingProject } = usePortalProject(viewerClient, projectId);

  return (
    <PortalContext.Provider
      value={{
        viewerJwt,
        projectId,
        viewerClient,
        project,
        isLoadingProject,
        clearSession: onClearSession,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};
