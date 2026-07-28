import type { FileCategory } from '../types/file';

/**
 * Maps a MIME type string or filename extension to a unified FileCategory.
 */
export function getCategoryFromMimeOrExt(mimeType?: string, fileName?: string): FileCategory {
  const mime = (mimeType || '').toLowerCase();
  const ext = (fileName || '').split('.').pop()?.toLowerCase() || '';

  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff'].includes(ext)) {
    return 'image';
  }

  if (mime.startsWith('video/') || ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv'].includes(ext)) {
    return 'video';
  }

  if (mime.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(ext)) {
    return 'audio';
  }

  if (mime === 'application/pdf' || ext === 'pdf') {
    return 'pdf';
  }

  if (ext === 'md' || ext === 'markdown' || mime === 'text/markdown') {
    return 'code'; // Rendered markdown or code view
  }

  if (
    [
      'ts', 'tsx', 'js', 'jsx', 'json', 'html', 'css', 'scss', 'py', 'go',
      'rs', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'sql', 'sh', 'yaml', 'yml', 'xml', 'env'
    ].includes(ext) ||
    mime.includes('javascript') || mime.includes('typescript') || mime.includes('json') || mime.startsWith('text/')
  ) {
    return 'code';
  }

  if (
    mime.includes('zip') || mime.includes('tar') || mime.includes('compressed') ||
    ['zip', 'tar', 'gz', '7z', 'rar', 'bz2'].includes(ext)
  ) {
    return 'archive';
  }

  if (
    ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv'].includes(ext) ||
    mime.includes('word') || mime.includes('excel') || mime.includes('powerpoint')
  ) {
    return 'document';
  }

  return 'other';
}

/**
 * Format bytes into human-readable strings (KB, MB, GB).
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${value} ${sizes[i] || 'B'}`;
}

/**
 * Formats transfer speed (e.g. 1.5 MB/s)
 */
export function formatSpeed(bps: number): string {
  if (!bps || bps <= 0) return '0 B/s';
  return `${formatBytes(bps)}/s`;
}
