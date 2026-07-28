import type { GenerateShareLinkRequest } from '../types.ts';

export function validateGenerateShareLinkRequest(payload: any): { valid: true; value: GenerateShareLinkRequest } | { valid: false; error: string } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Request body must be a valid JSON object' };
  }

  const projectId = payload.projectId || payload.project_id;
  if (!projectId || typeof projectId !== 'string' || projectId.trim().length < 8) {
    return { valid: false, error: 'Valid project_id (UUID) is required' };
  }

  const expiresAt = payload.expiresAt || payload.expires_at || null;
  if (expiresAt) {
    const expDate = new Date(expiresAt);
    if (isNaN(expDate.getTime())) {
      return { valid: false, error: 'expires_at must be a valid ISO timestamp' };
    }
    if (expDate <= new Date()) {
      return { valid: false, error: 'expires_at timestamp must be in the future' };
    }
  }

  const password = payload.password || null;
  if (password !== null && (typeof password !== 'string' || password.trim().length < 6)) {
    return { valid: false, error: 'Password must be at least 6 characters long' };
  }

  const notes = payload.notes ? String(payload.notes).trim() : null;
  const maxViews = payload.maxViews || payload.max_views ? Number(payload.maxViews || payload.max_views) : null;

  return {
    valid: true,
    value: {
      projectId: projectId.trim(),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      password: password ? password.trim() : null,
      notes,
      maxViews,
    },
  };
}
