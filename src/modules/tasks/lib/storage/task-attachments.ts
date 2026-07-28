import { supabase } from '../../../../lib/supabase/client';
import type { TaskAttachmentItem } from '../types/task';

const BUCKET_CANDIDATES = ['project-files', 'project-thumbnails', 'public'];
const MAX_FILE_SIZE_MB = 25;

export async function uploadTaskAttachmentFile(
  taskId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ fileName: string; fileUrl: string }> {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE_MB}MB.`);
  }

  const extension = file.name.split('.').pop() || 'bin';
  const filePath = `tasks/${taskId}/${crypto.randomUUID()}.${extension}`;

  if (onProgress) onProgress(30);

  // 1. Try candidates in Supabase storage
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
          fileName: file.name,
          fileUrl: publicUrlData?.publicUrl || '',
        };
      }
    } catch {
      // Try next bucket
    }
  }

  // 2. Fallback to client Object URL if no buckets exist in Supabase storage instance
  if (onProgress) onProgress(100);
  const objectUrl = URL.createObjectURL(file);

  return {
    fileName: file.name,
    fileUrl: objectUrl,
  };
}

export async function deleteTaskAttachmentFile(fileUrl: string): Promise<void> {
  try {
    if (!fileUrl || fileUrl.startsWith('blob:')) return;

    for (const bucketName of BUCKET_CANDIDATES) {
      if (fileUrl.includes(bucketName)) {
        const path = fileUrl.split(`${bucketName}/`).pop() || fileUrl;
        await (supabase as any).storage.from(bucketName).remove([path]);
        break;
      }
    }
  } catch {
    // Ignore cleanup failures
  }
}
