import type { ReactNode } from 'react';
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

/**
 * Enterprise Authentication State Interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  error: Error | null;
}

/**
 * AuthGuard Component Props
 */
export interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Auth Context API
 */
export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
  getSession: () => Promise<Session | null>;
}

/**
 * Session Validation Result
 */
export interface SessionValidationResult {
  isValid: boolean;
  session: Session | null;
  user: User | null;
  error?: Error | null;
}

/**
 * Auth State Change Listener Callback
 */
export type AuthStateChangeHandler = (
  event: AuthChangeEvent,
  session: Session | null
) => void;
