import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { normalizeClientError } from '../../utils/client-errors';
import type { TimelineEntry, CreateTimelineEntryPayload } from '../../../modules/timeline/lib/types/timeline';

/**
 * Enterprise Timeline Data Access Layer (PHASE 09)
 * Single source of truth for all project update queries and mutations.
 * Pure data layer: ZERO mock data, ZERO SELECT * queries.
 */

const TIMELINE_SELECT_COLUMNS =
  'id, project_id, title, description, entry_date, attachments, created_by, created_at';

export function mapRowToTimelineEntry(row: any): TimelineEntry {
  let parsedAttachments = [];
  if (Array.isArray(row.attachments)) {
    parsedAttachments = row.attachments;
  } else if (typeof row.attachments === 'string') {
    try {
      parsedAttachments = JSON.parse(row.attachments);
    } catch {
      parsedAttachments = [];
    }
  }

  // Infer updateType & tags from JSON or title and clean description text
  let rawDesc = String(row.description || '');
  let updateType = 'general';

  const typeMatch = rawDesc.match(/\[TYPE:([^\]]+)\]/);
  if (typeMatch && typeMatch[1]) {
    updateType = typeMatch[1];
    rawDesc = rawDesc.replace(/\[TYPE:[^\]]+\]\s*/g, '');
  } else if (rawDesc.toLowerCase().includes('feature') || String(row.title || '').toLowerCase().includes('feature')) {
    updateType = 'feature';
  } else if (rawDesc.toLowerCase().includes('fix') || String(row.title || '').toLowerCase().includes('fix')) {
    updateType = 'bug_fix';
  } else if (rawDesc.toLowerCase().includes('deploy') || String(row.title || '').toLowerCase().includes('deploy')) {
    updateType = 'deployment';
  } else if (rawDesc.toLowerCase().includes('milestone') || String(row.title || '').toLowerCase().includes('milestone')) {
    updateType = 'milestone';
  } else if (rawDesc.toLowerCase().includes('doc') || String(row.title || '').toLowerCase().includes('doc')) {
    updateType = 'documentation';
  }

  return {
    id: String(row.id),
    projectId: String(row.project_id),
    title: String(row.title),
    description: rawDesc,
    entryDate: row.entry_date ? String(row.entry_date) : String(row.created_at),
    updateType: updateType as any,
    visibility: 'public',
    tags: [],
    attachments: parsedAttachments.map((a: any) => ({
      id: String(a.id || Math.random()),
      fileName: String(a.fileName || a.file_name || a.name || 'Attachment'),
      fileUrl: String(a.fileUrl || a.file_url || a.url || ''),
      mimeType: a.mimeType || a.mime_type || undefined,
      sizeBytes: a.sizeBytes || a.size_bytes || undefined,
    })),
    createdBy: row.created_by ? String(row.created_by) : undefined,
    createdAt: String(row.created_at),
  };
}

/**
 * Fetch project timeline updates from Supabase project_updates table
 */
export async function fetchProjectUpdates(projectId?: string): Promise<TimelineEntry[]> {
  try {
    let query = (supabase as any)
      .from('project_updates')
      .select(TIMELINE_SELECT_COLUMNS)
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    if (!Array.isArray(data)) return [];
    return data.map(mapRowToTimelineEntry);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch project updates.';
    throw new Error(message);
  }
}

/**
 * Insert a new timeline update entry into project_updates
 */
export async function createProjectUpdate(payload: CreateTimelineEntryPayload): Promise<TimelineEntry> {
  if (!payload.projectId) throw new Error('Project ID is required.');
  if (!payload.title.trim()) throw new Error('Title is required.');

  try {
    const record = {
      project_id: payload.projectId,
      title: payload.title.trim(),
      description: payload.description || '',
      content: payload.description || payload.title.trim(),
      entry_date: payload.entryDate || new Date().toISOString().split('T')[0],
      attachments: payload.attachments || [],
    };

    const { data, error } = await (supabase as any)
      .from('project_updates')
      .insert(record)
      .select(TIMELINE_SELECT_COLUMNS)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapRowToTimelineEntry(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create timeline update.';
    throw new Error(message);
  }
}

/**
 * Delete a timeline update entry
 */
export async function deleteProjectUpdate(entryId: string): Promise<boolean> {
  if (!entryId) throw new Error('Entry ID is required.');

  try {
    const { error } = await (supabase as any)
      .from('project_updates')
      .delete()
      .eq('id', entryId);

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete timeline update.';
    throw new Error(message);
  }
}

/**
 * React Query Hook: useProjectUpdates(projectId)
 * Query Key: ["project-updates", projectId]
 */
export function useProjectUpdates(projectId?: string) {
  return useQuery<TimelineEntry[]>({
    queryKey: ['project-updates', projectId],
    queryFn: async (): Promise<TimelineEntry[]> => {
      return await fetchProjectUpdates(projectId);
    },
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    gcTime: 1000 * 60 * 10,   // 10 minutes garbage collection
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * React Query Mutation Hook: useCreateProjectUpdate()
 * Enterprise Optimistic Insertion & Automatic Rollback
 */
export function useCreateProjectUpdate() {
  const queryClient = useQueryClient();

  return useMutation<TimelineEntry, Error, CreateTimelineEntryPayload, { previousUpdates?: TimelineEntry[] }>({
    mutationFn: async (payload) => {
      return await createProjectUpdate(payload);
    },
    onMutate: async (newUpdatePayload) => {
      const queryKey = ['project-updates', newUpdatePayload.projectId];

      // 1. Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey });

      // 2. Snapshot previous timeline entries
      const previousUpdates = queryClient.getQueryData<TimelineEntry[]>(queryKey) || [];

      // 3. Clean description for optimistic entry display
      let rawDesc = newUpdatePayload.description || '';
      if (rawDesc.startsWith('[TYPE:')) {
        rawDesc = rawDesc.replace(/\[TYPE:[^\]]+\]\s*/g, '');
      }

      // 4. Create Optimistic Timeline Item
      const optimisticEntry: TimelineEntry = {
        id: `temp-optimistic-${crypto.randomUUID()}`,
        projectId: newUpdatePayload.projectId,
        title: newUpdatePayload.title.trim(),
        description: rawDesc,
        entryDate: newUpdatePayload.entryDate || new Date().toISOString().split('T')[0],
        updateType: newUpdatePayload.updateType || 'general',
        visibility: newUpdatePayload.visibility || 'public',
        tags: newUpdatePayload.tags || [],
        attachments: newUpdatePayload.attachments || [],
        createdAt: new Date().toISOString(),
      };

      // 5. Instantly update React Query Cache with optimistic entry
      queryClient.setQueryData<TimelineEntry[]>(queryKey, (old = []) => [optimisticEntry, ...old]);

      return { previousUpdates };
    },
    onError: (err, newUpdatePayload, context) => {
      // Rollback to previous cache snapshot on error
      if (context?.previousUpdates) {
        queryClient.setQueryData(
          ['project-updates', newUpdatePayload.projectId],
          context.previousUpdates
        );
      }
    },
    onSettled: (_, __, variables) => {
      // Invalidate and refetch server data to replace optimistic entry with real DB row
      queryClient.invalidateQueries({ queryKey: ['project-updates', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-updates'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
