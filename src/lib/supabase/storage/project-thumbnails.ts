import { supabase } from '../client';
import { normalizeClientError } from '../../utils/client-errors';

const BUCKET_NAME = 'project-thumbnails';
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Enterprise Project Thumbnail Storage Handler
 * Uploads project cover image files directly to Supabase Storage.
 * Strictly validates MIME types, file sizes, and generates sanitized UUID paths.
 */
export async function uploadProjectThumbnail(file: File): Promise<UploadResult> {
  try {
    // 1. Validate File MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      throw new Error('Invalid file type. Allowed formats: PNG, JPG, JPEG, WEBP.');
    }

    // 2. Validate File Size (Max 5MB)
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE_MB}MB.`);
    }

    // 3. Generate Sanitized UUID Path
    const extension = file.name.split('.').pop() || 'png';
    const filePath = `${crypto.randomUUID()}.${extension}`;

    // 4. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      // If bucket does not exist, return a clear, user-friendly message
      if (error.message.includes('not found') || error.message.includes('Bucket')) {
        throw new Error('Storage bucket "project-thumbnails" is not configured in Supabase.');
      }
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    // 5. Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
    };
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function deleteProjectThumbnail(filePath: string): Promise<void> {
  try {
    if (!filePath) return;
    const path = filePath.includes('/') ? filePath.split('/').pop() || filePath : filePath;
    await supabase.storage.from(BUCKET_NAME).remove([path]);
  } catch {
    // Ignore cleanup failures gracefully
  }
}
