/**
 * Sanitizes filenames for safe storage path generation.
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return 'unnamed_file';
  return filename
    .replace(/[^a-zA-Z0-9_.-]/g, '_')
    .replace(/_{2,}/g, '_');
}

/**
 * Builds a standardized Supabase storage object path:
 * project_id / [folder_id | 'root'] / UUID-filename.ext
 */
export function buildStoragePath(projectId?: string | null, folderId?: string | null, originalName?: string): string {
  const safeProj = projectId || 'global';
  const safeFolder = folderId || 'root';
  const ext = originalName ? originalName.split('.').pop() : '';
  const uuid = crypto.randomUUID();
  const sanitized = originalName ? sanitizeFilename(originalName.replace(/\.[^/.]+$/, '')) : 'file';

  const extSuffix = ext ? `.${ext}` : '';
  return `${safeProj}/${safeFolder}/${uuid}_${sanitized}${extSuffix}`;
}
