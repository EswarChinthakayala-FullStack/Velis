import { format } from 'date-fns';

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

export function buildScreenshotStoragePath(
  projectId?: string | null,
  fileName = 'screenshot.png'
): string {
  const safeProj = projectId || 'global';
  const now = new Date();
  const year = format(now, 'yyyy');
  const month = format(now, 'MM');
  const sanitized = sanitizeFileName(fileName);
  const uuid = crypto.randomUUID().slice(0, 8);

  return `${safeProj}/screenshots/${year}/${month}/${uuid}_${sanitized}`;
}
