import type { SyncPayload } from './types.ts';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateSyncPayload(payload: any): { isValid: boolean; projectId?: string; repoUrl?: string; error?: string } {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Invalid JSON request payload.' };
  }

  const projectId = payload.project_id || payload.projectId;
  const repoUrl = payload.repo_url || payload.repoUrl;

  if (!projectId) {
    return { isValid: false, error: 'project_id is required.' };
  }

  if (typeof projectId === 'string' && !UUID_REGEX.test(projectId.trim())) {
    // If not standard UUID format, allow non-empty string IDs
    if (!projectId.trim()) {
      return { isValid: false, error: 'Invalid project_id format.' };
    }
  }

  return {
    isValid: true,
    projectId: String(projectId).trim(),
    repoUrl: repoUrl ? String(repoUrl).trim() : undefined,
  };
}
