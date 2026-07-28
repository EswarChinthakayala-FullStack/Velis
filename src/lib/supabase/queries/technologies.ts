import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import type { TechnologyItem } from '../../../types/technology';
import { normalizeClientError } from '../../utils/client-errors';

/**
 * Enterprise Technologies Data Access Layer
 * Manages project_technologies queries and CRUD operations.
 * ZERO mock data, ZERO SELECT * queries.
 */

const TECH_SELECT_COLUMNS = 'id, project_id, name, icon_url';

export async function fetchProjectTechnologies(projectId: string): Promise<TechnologyItem[]> {
  if (!projectId) return [];
  try {
    const { data, error } = await (supabase as any)
      .from('project_technologies')
      .select(TECH_SELECT_COLUMNS)
      .eq('project_id', projectId)
      .order('name', { ascending: true });

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return (data || []).map((row: any) => ({
      id: String(row.id),
      projectId: String(row.project_id),
      name: String(row.name),
      iconUrl: row.icon_url ? String(row.icon_url) : undefined,
    }));
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function fetchPopularTechnologies(): Promise<TechnologyItem[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('project_technologies')
      .select('name, icon_url');

    if (error) return [];

    const usageMap = new Map<string, { name: string; iconUrl?: string; count: number }>();
    (data || []).forEach((row: any) => {
      const name = String(row.name).trim();
      const existing = usageMap.get(name.toLowerCase());
      if (existing) {
        existing.count += 1;
      } else {
        usageMap.set(name.toLowerCase(), {
          name,
          iconUrl: row.icon_url ? String(row.icon_url) : undefined,
          count: 1,
        });
      }
    });

    return Array.from(usageMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
      .map((item) => ({
        id: item.name,
        name: item.name,
        iconUrl: item.iconUrl,
        usageCount: item.count,
      }));
  } catch {
    return [];
  }
}

export async function fetchRecentTechnologies(): Promise<TechnologyItem[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('project_technologies')
      .select('id, name, icon_url')
      .order('id', { ascending: false })
      .limit(10);

    if (error) return [];

    const uniqueNames = new Set<string>();
    const result: TechnologyItem[] = [];

    (data || []).forEach((row: any) => {
      const name = String(row.name).trim();
      if (!uniqueNames.has(name.toLowerCase())) {
        uniqueNames.add(name.toLowerCase());
        result.push({
          id: String(row.id),
          name,
          iconUrl: row.icon_url ? String(row.icon_url) : undefined,
        });
      }
    });

    return result;
  } catch {
    return [];
  }
}

export async function addProjectTechnology(
  projectId: string,
  name: string,
  iconUrl?: string
): Promise<TechnologyItem> {
  try {
    const { data, error } = await (supabase as any)
      .from('project_technologies')
      .insert({
        project_id: projectId,
        name: name.trim(),
        icon_url: iconUrl || null,
      })
      .select(TECH_SELECT_COLUMNS)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return {
      id: String(data.id),
      projectId: String(data.project_id),
      name: String(data.name),
      iconUrl: data.icon_url ? String(data.icon_url) : undefined,
    };
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function removeProjectTechnology(id: string): Promise<void> {
  try {
    const { error } = await (supabase as any)
      .from('project_technologies')
      .delete()
      .eq('id', id);

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

// React Query Hooks

export function useProjectTechnologies(projectId?: string) {
  return useQuery({
    queryKey: ['project_technologies', projectId],
    queryFn: () => fetchProjectTechnologies(projectId!),
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 2,
  });
}

export function usePopularTechnologies() {
  return useQuery({
    queryKey: ['popular_technologies'],
    queryFn: fetchPopularTechnologies,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRecentTechnologies() {
  return useQuery({
    queryKey: ['recent_technologies'],
    queryFn: fetchRecentTechnologies,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddProjectTechnology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, name, iconUrl }: { projectId: string; name: string; iconUrl?: string }) =>
      addProjectTechnology(projectId, name, iconUrl),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project_technologies', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['popular_technologies'] });
    },
  });
}

export function useRemoveProjectTechnology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) =>
      removeProjectTechnology(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project_technologies', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
  });
}
