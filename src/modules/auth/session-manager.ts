import type { QueryClient } from '@tanstack/react-query';
import type { Location } from 'react-router-dom';

const IS_DEV = import.meta.env.DEV;

/**
 * Enterprise Session & Cache Manager
 * Manages query cache invalidation, state cleanup, and redirect location tracking.
 */
export const sessionManager = {
  /**
   * Clears all cached authentication, user profile, and session data in React Query.
   */
  clearAuthCache(queryClient?: QueryClient): void {
    if (!queryClient) return;

    // Invalidate and remove queries for auth, profile, and permissions
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    queryClient.invalidateQueries({ queryKey: ['session'] });
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    queryClient.invalidateQueries({ queryKey: ['permissions'] });

    queryClient.removeQueries({ queryKey: ['auth'] });
    queryClient.removeQueries({ queryKey: ['session'] });
    queryClient.removeQueries({ queryKey: ['profile'] });

    this.log('Auth cache cleared and invalidated');
  },

  /**
   * Extracts and formats the redirect target path for post-login redirection.
   */
  getRedirectState(location: Location) {
    const fullPath = `${location.pathname}${location.search}${location.hash}`;
    
    // Avoid storing /login or public paths as the return destination
    if (fullPath === '/login' || fullPath === '/register' || fullPath === '/') {
      return { from: '/app/dashboard' };
    }

    return { from: fullPath };
  },

  /**
   * Development-only logger for authentication events.
   */
  log(message: string, ...details: any[]): void {
    if (IS_DEV) {
      console.log(`[AuthGuard] ${message}`, ...details);
    }
  },

  /**
   * Development-only error logger.
   */
  logError(message: string, error?: any): void {
    if (IS_DEV) {
      console.error(`[AuthGuard] ${message}`, error ?? '');
    }
  },
};

export default sessionManager;
