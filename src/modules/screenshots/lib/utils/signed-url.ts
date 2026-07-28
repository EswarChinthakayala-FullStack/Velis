import { supabase } from '../../../../lib/supabase/client';

const SIGNED_URL_CACHE = new Map<string, { url: string; expiresAt: number }>();
const BUCKET_NAME = 'project-assets';

export async function getSignedScreenshotUrl(
  storagePath: string,
  expiresInSeconds = 3600
): Promise<string> {
  if (!storagePath) return '';
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
      const { data: pubData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);
      return pubData?.publicUrl || '';
    }

    SIGNED_URL_CACHE.set(storagePath, {
      url: data.signedUrl,
      expiresAt: now + expiresInSeconds * 1000,
    });

    return data.signedUrl;
  } catch {
    return '';
  }
}
