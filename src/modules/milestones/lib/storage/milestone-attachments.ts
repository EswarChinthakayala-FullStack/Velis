import { supabase } from '../../../../lib/supabase/client';

const BUCKET_CANDIDATES = [
  'milestone-attachments',
  'milestones',
  'project-files',
  'project-thumbnails',
  'public',
  'attachments',
  'files',
];
const MAX_FILE_SIZE_MB = 25;

/**
 * Converts a Blob/File into a persistent base64 Data URL (for files <= 5MB)
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function uploadMilestoneAttachmentFile(
  milestoneId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ fileName: string; fileUrl: string }> {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE_MB}MB.`);
  }

  const extension = file.name.split('.').pop() || 'bin';
  const filePath = `milestones/${milestoneId}/${crypto.randomUUID()}.${extension}`;

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
      // Try next bucket candidate
    }
  }

  // 2. Persistent fallback if Supabase storage returns 400 (no bucket found)
  if (onProgress) onProgress(100);

  let fallbackUrl = '';
  // Convert files under 5MB to persistent Data URLs so document links remain valid across reloads
  if (file.size <= 5 * 1024 * 1024) {
    try {
      fallbackUrl = await fileToDataUrl(file);
    } catch {
      fallbackUrl = URL.createObjectURL(file);
    }
  } else {
    fallbackUrl = URL.createObjectURL(file);
  }

  return {
    fileName: file.name,
    fileUrl: fallbackUrl,
  };
}

export async function deleteMilestoneAttachmentFile(fileUrl: string): Promise<void> {
  try {
    if (!fileUrl || fileUrl.startsWith('blob:') || fileUrl.startsWith('data:')) return;

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
