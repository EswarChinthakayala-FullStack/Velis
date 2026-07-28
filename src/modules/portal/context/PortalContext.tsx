import { createContext, useContext } from 'react';
import type { PortalSessionContextType } from '../lib/types/portal';

export const PortalContext = createContext<PortalSessionContextType | undefined>(undefined);

export function usePortalContext(): PortalSessionContextType {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error('usePortalContext must be used within a PortalAuthProvider');
  }
  return ctx;
}
