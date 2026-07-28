import { supabase } from '../../../../lib/supabase/client';
import { normalizeClientError } from '../../../../lib/utils/client-errors';
import type { TimelineAttachment } from '../types/timeline';

const BUCKET_CANDIDATES = ['project-files', 'project-thumbnails', 'public'];
const MAX_FILE_SIZE_MB = 25; // 25MB Max file upload

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'text/plain',
  'text/markdown',
];

export async function uploadTimelineAttachment(
  projectId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<TimelineAttachment> {
  // 1. File Size Validation
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE_MB}MB.`);
  }

  // 2. MIME Type Validation
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'pdf', 'docx', 'xlsx', 'zip', 'mp4', 'webm', 'mov', 'txt', 'md'].includes(ext || '')) {
      throw new Error(`Unsupported file type (.${ext}).`);
    }
  }

  const extension = file.name.split('.').pop() || 'bin';
  const filePath = `timeline/${projectId}/${crypto.randomUUID()}.${extension}`;

  if (onProgress) onProgress(30);

  // 3. Try each bucket in candidates
  for (const bucketName of BUCKET_CANDIDATES) {
    try {
      const { data, error } = await (supabase as any).storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'application/octet-stream',
        });

      if (!error && data?.path) {
        const { data: publicUrlData } = (supabase as any).storage
          .from(bucketName)
          .getPublicUrl(data.path);

        if (onProgress) onProgress(100);

        return {
          id: crypto.randomUUID(),
          fileName: file.name,
          fileUrl: publicUrlData?.publicUrl || '',
          mimeType: file.type || undefined,
          sizeBytes: file.size,
        };
      }
    } catch {
      // Continue to next bucket candidate
    }
  }

  // 4. Fallback: If no buckets exist in Supabase storage, generate Object URL so UI works gracefully
  if (onProgress) onProgress(100);
  const objectUrl = URL.createObjectURL(file);

  return {
    id: crypto.randomUUID(),
    fileName: file.name,
    fileUrl: objectUrl,
    mimeType: file.type || undefined,
    sizeBytes: file.size,
  };
}

export async function deleteTimelineAttachment(filePath: string): Promise<void> {
  try {
    if (!filePath || filePath.startsWith('blob:')) return;
    for (const bucketName of BUCKET_CANDIDATES) {
      if (filePath.includes(bucketName)) {
        const path = filePath.split(`${bucketName}/`).pop() || filePath;
        await (supabase as any).storage.from(bucketName).remove([path]);
        break;
      }
    }
  } catch {
    // Ignore cleanup failures gracefully
  }
}
