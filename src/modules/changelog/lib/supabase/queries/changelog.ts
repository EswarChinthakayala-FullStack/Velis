import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../../../lib/supabase';
import type { ChangelogEntry, CreateChangelogInput, UpdateChangelogInput } from '../../../types/changelog';

const CHANGELOG_SELECT_COLUMNS =
  'id, project_id, version, title, summary, description, released_at, release_type, status, created_by, attachments, github_release_url, environment, created_at, updated_at';

const CHANGELOG_CORE_COLUMNS =
  'id, project_id, version, title, description, released_at';

function mapRowToEntry(row: any): ChangelogEntry {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    version: row.version || 'v1.0.0',
    title: row.title || 'Release',
    summary: row.summary || undefined,
    description: row.description || undefined,
    releasedAt: row.released_at || row.created_at || new Date().toISOString(),
    releaseType: row.release_type || 'stable',
    status: row.status || 'published',
    createdBy: row.created_by || undefined,
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    githubReleaseUrl: row.github_release_url || undefined,
    environment: row.environment || 'production',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export async function fetchProjectChangelog(projectId?: string | null): Promise<ChangelogEntry[]> {
  try {
    let query = (supabase as any)
      .from('changelog_entries')
      .select('id, project_id, version, title, summary, description, release_type, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (projectId && projectId !== 'all') {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapRowToEntry);
  } catch (err: any) {
    // Fallback query for minimalist schema
    try {
      let fallbackQuery = (supabase as any)
        .from('changelog_entries')
        .select('id, project_id, version, title, description, created_at')
        .order('created_at', { ascending: false });

      if (projectId && projectId !== 'all') {
        fallbackQuery = fallbackQuery.eq('project_id', projectId);
      }

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      if (fallbackError) throw fallbackError;
      return (fallbackData || []).map(mapRowToEntry);
    } catch (fallbackErr: any) {
      return [];
    }
  }
}

export function useProjectChangelog(projectId?: string | null) {
  return useQuery({
    queryKey: ['project-changelog', projectId || 'all'],
    queryFn: () => fetchProjectChangelog(projectId),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

export function useCreateChangelogEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateChangelogInput) => {
      try {
        const { data, error } = await (supabase as any)
          .from('changelog_entries')
          .insert({
            project_id: input.projectId,
            version: input.version,
            title: input.title,
            summary: input.summary || null,
            description: input.description || null,
            released_at: input.releasedAt || new Date().toISOString(),
            release_type: input.releaseType || 'stable',
            status: input.status || 'published',
            attachments: input.attachments || [],
            github_release_url: input.githubReleaseUrl || null,
            environment: input.environment || 'production',
          })
          .select(CHANGELOG_SELECT_COLUMNS)
          .single();

        if (error) throw error;
        return data;
      } catch (err: any) {
        // Fallback insert with core 0016_changelog columns
        const { data: fallbackData, error: fallbackError } = await (supabase as any)
          .from('changelog_entries')
          .insert({
            project_id: input.projectId,
            version: input.version,
            title: input.title,
            description: input.description || null,
            released_at: input.releasedAt || new Date().toISOString(),
          })
          .select(CHANGELOG_CORE_COLUMNS)
          .single();

        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-changelog'] });
    },
  });
}

export function useUpdateChangelogEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateChangelogInput) => {
      try {
        const payload: any = {
          version: input.version,
          title: input.title,
          summary: input.summary,
          description: input.description,
          released_at: input.releasedAt,
          release_type: input.releaseType,
          status: input.status,
          attachments: input.attachments,
          github_release_url: input.githubReleaseUrl,
          environment: input.environment,
          updated_at: new Date().toISOString(),
        };
        Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

        const { data, error } = await (supabase as any)
          .from('changelog_entries')
          .update(payload)
          .eq('id', input.id)
          .select(CHANGELOG_SELECT_COLUMNS)
          .single();

        if (error) throw error;
        return data;
      } catch (err: any) {
        // Fallback update with core 0016_changelog columns
        const fallbackPayload: any = {
          version: input.version,
          title: input.title,
          description: input.description,
          released_at: input.releasedAt,
        };
        Object.keys(fallbackPayload).forEach((key) => fallbackPayload[key] === undefined && delete fallbackPayload[key]);

        const { data: fallbackData, error: fallbackError } = await (supabase as any)
          .from('changelog_entries')
          .update(fallbackPayload)
          .eq('id', input.id)
          .select(CHANGELOG_CORE_COLUMNS)
          .single();

        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-changelog'] });
    },
  });
}

export function useDeleteChangelogEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('changelog_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-changelog'] });
    },
  });
}
