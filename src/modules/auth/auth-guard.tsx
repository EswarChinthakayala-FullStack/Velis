import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from './auth-hooks';
import { AuthLoadingScreen } from './loading-screen';
import { sessionManager } from './session-manager';
import type { AuthGuardProps } from './auth-types';

/**
 * AuthGuard Component (PHASE 04)
 * Enterprise Route Protection Guard for Velis.
 * 
 * Validates active Supabase Auth sessions before rendering protected route content.
 * Prevents unauthorized UI rendering, flashes, and infinite redirect loops.
 * Single source of truth driven directly by Supabase Auth APIs.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  redirectTo = '/login',
}) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading, isError, error } = useAuthSession();

  // 1. Session Initialization / Validation Loading State
  if (isLoading) {
    return fallback ? <>{fallback}</> : <AuthLoadingScreen message="Verifying workspace credentials..." />;
  }

  // 2. Network Error or Failure Fallback State
  if (isError && !isAuthenticated) {
    sessionManager.logError('Session validation encounter error:', error);
    sessionManager.clearAuthCache(queryClient);

    return (
      <Navigate
        to={redirectTo}
        state={sessionManager.getRedirectState(location)}
        replace
      />
    );
  }

  // 3. Unauthenticated Session State -> Redirect to Login
  if (!isAuthenticated) {
    sessionManager.log('Unauthenticated access attempt blocked for:', location.pathname);
    sessionManager.clearAuthCache(queryClient);

    return (
      <Navigate
        to={redirectTo}
        state={sessionManager.getRedirectState(location)}
        replace
      />
    );
  }

  // 4. Authenticated & Verified Session -> Render Protected Content
  sessionManager.log('Session verified. Granting access to:', location.pathname);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default AuthGuard;
