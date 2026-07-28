import React, { createContext, useContext, type ReactNode } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

interface ViewerContextType {
  viewerJwt: string | null;
  projectId: string | null;
  viewerClient: SupabaseClient | null;
}

const ViewerContext = createContext<ViewerContextType>({
  viewerJwt: null,
  projectId: null,
  viewerClient: null
});

export const ViewerProvider: React.FC<{
  viewerJwt: string | null;
  projectId: string | null;
  viewerClient: SupabaseClient | null;
  children: ReactNode;
}> = ({ viewerJwt, projectId, viewerClient, children }) => {
  return (
    <ViewerContext.Provider value={{ viewerJwt, projectId, viewerClient }}>
      {children}
    </ViewerContext.Provider>
  );
};

export const useViewerContext = () => useContext(ViewerContext);
