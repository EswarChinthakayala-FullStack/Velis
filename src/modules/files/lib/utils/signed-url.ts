import { supabase } from '../../../../lib/supabase/client';

const SIGNED_URL_CACHE = new Map<string, { url: string; expiresAt: number }>();
const BUCKET_NAME = 'project-assets';

/**
 * Generates a signed download/preview URL from Supabase Storage with caching.
 * Expiration defaults to 3600 seconds (1 hour).
 */
export async function getSignedFileUrl(storagePath: string, expiresInSeconds = 3600): Promise<string> {
  if (!storagePath) return '';

  // If path is already a full http(s) URL, return directly
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }

  const now = Date.now();
  const cached = SIGNED_URL_CACHE.get(storagePath);
  if (cached && cached.expiresAt > now + 60000) {
    return cached.url;
  }

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      // Fallback: try public URL if signed URL fails or bucket is public
      const { data: publicData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

      if (publicData?.publicUrl) {
        return publicData.publicUrl;
      }
      throw error || new Error('Failed to create signed URL');
    }

    SIGNED_URL_CACHE.set(storagePath, {
      url: data.signedUrl,
      expiresAt: now + expiresInSeconds * 1000,
    });

    return data.signedUrl;
  } catch {
    // Return empty fallback string if completely unavailable
    return '';
  }
}
