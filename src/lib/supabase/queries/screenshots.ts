import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { normalizeClientError } from '../../utils/client-errors';
import type { ScreenshotItem } from '../../../modules/screenshots/lib/types/screenshot';

const BUCKET_NAME = 'project-assets';
const FALLBACK_BUCKETS = ['assets', 'public', 'documents'];

/**
 * Fetch progress screenshots for a project from DB `screenshots`.
 * Falls back gracefully to Supabase Storage listing if DB table is missing / empty.
 */
export async function fetchProjectScreenshots(projectId?: string | null): Promise<ScreenshotItem[]> {
  try {
    let items: ScreenshotItem[] = [];
    let dbSuccess = false;

    // 1. Query DB `screenshots`
    try {
      let query = (supabase as any)
        .from('screenshots')
        .select('id, project_id, milestone_id, title, image_url, sort_order, taken_at');

      if (projectId && projectId !== 'all') {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query
        .order('taken_at', { ascending: false })
        .order('sort_order', { ascending: true });

      if (!error && data && Array.isArray(data)) {
        items = data.map((s: any) => ({
          id: s.id,
          projectId: s.project_id,
          milestoneId: s.milestone_id,
          milestoneTitle: s.milestone_id ? 'Milestone Progress' : null,
          title: s.title || 'Screenshot Update',
          description: null,
          storagePath: s.image_url,
          publicUrl: s.image_url.startsWith('http') ? s.image_url : null,
          mimeType: 'image/png',
          fileSize: 0,
          width: 1920,
          height: 1080,
          moduleName: 'General',
          takenAt: s.taken_at || new Date().toISOString(),
          sortOrder: s.sort_order || 0,
          uploadedBy: 'System Lead',
          createdAt: s.taken_at || new Date().toISOString(),
          updatedAt: s.taken_at || new Date().toISOString(),
        }));
        dbSuccess = true;
      }
    } catch {
      // Fallback
    }

    // 2. Direct Storage listing fallback if DB table missing / empty
    if (!dbSuccess || items.length === 0) {
      const prefix = `${projectId || 'global'}/screenshots`;
      const { data: storageObjects } = await supabase.storage
        .from(BUCKET_NAME)
        .list(prefix, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (storageObjects) {
        for (const obj of storageObjects) {
          if (obj.id !== null) {
            const fullPath = `${prefix}/${obj.name}`;
            const { data: pubData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fullPath);

            items.push({
              id: obj.id || fullPath,
              projectId: projectId || null,
              milestoneId: null,
              title: obj.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
              storagePath: fullPath,
              publicUrl: pubData?.publicUrl,
              mimeType: obj.metadata?.mimetype || 'image/png',
              fileSize: obj.metadata?.size || 0,
              width: 1920,
              height: 1080,
              moduleName: 'Progress Update',
              takenAt: obj.created_at || new Date().toISOString(),
              sortOrder: 0,
              uploadedBy: 'System Lead',
              createdAt: obj.created_at || new Date().toISOString(),
              updatedAt: obj.created_at || new Date().toISOString(),
            });
          }
        }
      }
    }

    return items;
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

/**
 * Upload screenshot to Supabase Storage + insert DB metadata in `screenshots`.
 */
export async function uploadScreenshotFile(
  file: File,
  metadata: {
    title: string;
    description?: string;
    milestoneId?: string | null;
    moduleName?: string;
    takenAt?: string;
    projectId?: string | null;
  }
): Promise<ScreenshotItem> {
  const safeProj = metadata.projectId || 'global';
  const uuidPath = `${safeProj}/screenshots/${crypto.randomUUID()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

  let uploadedPath = uuidPath;
  let publicUrlResult: string | null = null;
  let uploadErrorResult: any = null;

  // 1. Upload to primary bucket
  const { data: uploadData, error: primaryErr } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(uuidPath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'image/png',
    });

  if (primaryErr) {
    uploadErrorResult = primaryErr;
    if (primaryErr.message?.includes('Bucket not found') || (primaryErr as any)?.statusCode === 404) {
      for (const fallbackBucket of FALLBACK_BUCKETS) {
        const { data: fbData, error: fbErr } = await supabase.storage
          .from(fallbackBucket)
          .upload(uuidPath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type || 'image/png',
          });

        if (!fbErr && fbData) {
          uploadedPath = fbData.path;
          uploadErrorResult = null;
          break;
        }
      }

      if (uploadErrorResult) {
        publicUrlResult = URL.createObjectURL(file);
        uploadErrorResult = null;
      }
    }
  } else if (uploadData?.path) {
    uploadedPath = uploadData.path;
  }

  if (uploadErrorResult) {
    const normalized = normalizeClientError(uploadErrorResult);
    throw new Error(`Storage upload failed: ${normalized.message}`);
  }

  if (!publicUrlResult) {
    const { data: pubData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadedPath);
    publicUrlResult = pubData?.publicUrl || null;
  }

  const payload = {
    id: crypto.randomUUID(),
    project_id: metadata.projectId || null,
    milestone_id: metadata.milestoneId || null,
    title: metadata.title.trim(),
    image_url: publicUrlResult || uploadedPath,
    sort_order: 0,
    taken_at: metadata.takenAt || new Date().toISOString(),
  };

  // 2. Insert metadata into DB `screenshots`
  try {
    const { error: dbErr } = await (supabase as any).from('screenshots').insert(payload);
    if (dbErr) {
      console.warn('DB metadata insert warning (using storage object):', dbErr.message);
    }
  } catch {
    // Ignore fallback
  }

  return {
    id: payload.id,
    projectId: payload.project_id,
    milestoneId: payload.milestone_id,
    title: payload.title,
    description: metadata.description,
    storagePath: uploadedPath,
    publicUrl: payload.image_url,
    mimeType: file.type || 'image/png',
    fileSize: file.size,
    width: 1920,
    height: 1080,
    moduleName: metadata.moduleName || 'General',
    takenAt: payload.taken_at,
    sortOrder: payload.sort_order,
    uploadedBy: 'System Lead',
    createdAt: payload.taken_at,
    updatedAt: payload.taken_at,
  };
}

/**
 * Delete screenshot record from DB and Supabase Storage.
 */
export async function deleteScreenshotRecord(id: string, storagePath: string): Promise<void> {
  try {
    await (supabase as any).from('screenshots').delete().eq('id', id);
  } catch {
    // Ignore
  }

  if (storagePath && !storagePath.startsWith('blob:')) {
    await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
  }
}

// --- Reusable React Query Hooks ---

export function useProjectScreenshots(projectId?: string | null) {
  return useQuery<ScreenshotItem[], Error>({
    queryKey: ['screenshots', projectId || 'all'],
    queryFn: () => fetchProjectScreenshots(projectId),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useUploadScreenshotMutation(projectId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation<
    ScreenshotItem,
    Error,
    {
      file: File;
      title: string;
      description?: string;
      milestoneId?: string | null;
      moduleName?: string;
      takenAt?: string;
    }
  >({
    mutationFn: ({ file, ...meta }) => uploadScreenshotFile(file, { ...meta, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['screenshots', projectId || 'all'] });
    },
  });
}

export function useDeleteScreenshotMutation(projectId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; storagePath: string }>({
    mutationFn: ({ id, storagePath }) => deleteScreenshotRecord(id, storagePath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['screenshots', projectId || 'all'] });
    },
  });
}
