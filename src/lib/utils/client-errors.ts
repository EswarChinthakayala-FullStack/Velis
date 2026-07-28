export interface ClientError {
  code: string;
  message: string;
  field?: string;
}

/**
 * Enterprise Client Error Normalizer
 * Maps raw Supabase / PostgREST errors into clean, user-friendly domain error messages.
 */
export function normalizeClientError(error: unknown): ClientError {
  if (!error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred while processing the request.',
    };
  }

  const err = error as any;
  const message: string = err.message || err.error_description || String(err);
  const code: string = err.code || 'DATABASE_ERROR';

  // Postgres 23505: Unique constraint violation (e.g. duplicate email)
  if (code === '23505' || message.includes('unique constraint') || message.includes('already exists')) {
    return {
      code: 'DUPLICATE_RECORD',
      message: 'A client record with this email address already exists.',
      field: 'email',
    };
  }

  // Postgres 23503: Foreign key constraint violation
  if (code === '23503' || message.includes('foreign key constraint')) {
    return {
      code: 'FOREIGN_KEY_VIOLATION',
      message: 'Unable to perform action. Related user profile or project record was not found.',
    };
  }

  // Postgres 42P01 / 404 / PGRST116: Record not found
  if (code === 'PGRST116' || message.includes('JSON object requested, multiple (or no) rows returned')) {
    return {
      code: 'NOT_FOUND',
      message: 'The requested client account was not found or may have been deleted.',
    };
  }

  // Authentication & Authorization failures
  if (message.includes('JWT') || message.includes('Authentication') || code === '401') {
    return {
      code: 'UNAUTHORIZED',
      message: 'You must be signed in with valid credentials to perform this action.',
    };
  }

  // Postgres 42501 / RLS Policy Violation
  if (code === '42501' || message.includes('row-level security policy') || message.includes('403')) {
    return {
      code: 'PERMISSION_DENIED',
      message: 'Permission denied by Row-Level Security policy. Please apply RLS policy for project_technologies in Supabase SQL editor.',
    };
  }

  return {
    code,
    message: message || 'Failed to complete operation. Please try again.',
  };
}

export default normalizeClientError;
