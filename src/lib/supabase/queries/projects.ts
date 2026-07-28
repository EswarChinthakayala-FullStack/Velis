import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import type {
  ProjectItem,
  ProjectQueryFilter,
  PaginatedProjectsResult,
} from '../../../types/project';
import type { ProjectFormValues } from '../../validators/project-schema';
import { normalizeClientError } from '../../utils/client-errors';

/**
 * Enterprise Projects Data Access Layer
 * Streamlined data fetching with separated foreign-key lookups to eliminate long URL query strings.
 */

const PROJECT_SELECT_COLUMNS =
  'id, client_id, name, slug, description, status, priority, start_date, deadline, completion_percent, color, thumbnail_url, created_at, updated_at';

export async function fetchProjects(
  filter: ProjectQueryFilter = {}
): Promise<PaginatedProjectsResult> {
  try {
    const {
      search = '',
      status = 'all',
      priority = 'all',
      clientId,
      page = 1,
      pageSize = 12,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = filter;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = (supabase as any)
      .from('projects')
      .select(PROJECT_SELECT_COLUMNS, { count: 'exact' });

    if (search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`name.ilike.${term},description.ilike.${term}`);
    }

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (priority !== 'all') {
      query = query.eq('priority', priority);
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.warn('Projects fetch failed:', error.message);
      return { projects: [], totalCount: 0, totalPages: 1, page, pageSize };
    }

    const rawProjects = data || [];
    const totalCount = count ?? rawProjects.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    // Secondary client lookup to avoid monster nested PostgREST JOIN URLs
    const clientIds = Array.from(new Set(rawProjects.map((p: any) => p.client_id).filter(Boolean)));
    const clientMap: Record<string, { name: string; company?: string }> = {};

    if (clientIds.length > 0) {
      try {
        const { data: clientsData } = await (supabase as any)
          .from('clients')
          .select('id, name, company')
          .in('id', clientIds);

        (clientsData || []).forEach((c: any) => {
          clientMap[String(c.id)] = { name: String(c.name), company: c.company ? String(c.company) : undefined };
        });
      } catch {
        // Fallback silently if clients lookup fails
      }
    }

    const projects: ProjectItem[] = rawProjects.map((row: any) => {
      const clientInfo = row.client_id ? clientMap[String(row.client_id)] : undefined;
      return {
        id: String(row.id),
        clientId: row.client_id ? String(row.client_id) : undefined,
        clientName: clientInfo?.name,
        clientCompany: clientInfo?.company,
        name: String(row.name),
        slug: String(row.slug || row.id),
        description: row.description ? String(row.description) : undefined,
        status: row.status || 'planning',
        priority: row.priority || 'medium',
        startDate: row.start_date ? String(row.start_date) : undefined,
        deadline: row.deadline ? String(row.deadline) : undefined,
        completionPercent: Number(row.completion_percent ?? 0),
        color: row.color ? String(row.color) : '#FAFAFA',
        thumbnailUrl: row.thumbnail_url ? String(row.thumbnail_url) : undefined,
        technologies: [],
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at || row.created_at),
      };
    });

    return { projects, totalCount, totalPages, page, pageSize };
  } catch (err: any) {
    console.warn('Projects query error:', err?.message);
    return { projects: [], totalCount: 0, totalPages: 1, page: 1, pageSize: 12 };
  }
}

/**
 * Fetch a single project detail by ID or slug
 */
export async function fetchProjectById(idOrSlug: string): Promise<ProjectItem | null> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    let query = (supabase as any).from('projects').select(PROJECT_SELECT_COLUMNS);

    if (isUuid) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.single();
    if (error || !data) return null;

    let clientInfo: { name: string; company?: string } | undefined;
    if (data.client_id) {
      try {
        const { data: c } = await (supabase as any)
          .from('clients')
          .select('id, name, company')
          .eq('id', data.client_id)
          .maybeSingle();
        if (c) {
          clientInfo = { name: String(c.name), company: c.company ? String(c.company) : undefined };
        }
      } catch {
        // Fallback
      }
    }

    return {
      id: String(data.id),
      clientId: data.client_id ? String(data.client_id) : undefined,
      clientName: clientInfo?.name,
      clientCompany: clientInfo?.company,
      name: String(data.name),
      slug: String(data.slug || data.id),
      description: data.description ? String(data.description) : undefined,
      status: data.status || 'planning',
      priority: data.priority || 'medium',
      startDate: data.start_date ? String(data.start_date) : undefined,
      deadline: data.deadline ? String(data.deadline) : undefined,
      completionPercent: Number(data.completion_percent ?? 0),
      color: data.color ? String(data.color) : '#FAFAFA',
      thumbnailUrl: data.thumbnail_url ? String(data.thumbnail_url) : undefined,
      technologies: [],
      createdAt: String(data.created_at),
      updatedAt: String(data.updated_at || data.created_at),
    };
  } catch {
    return null;
  }
}

/**
 * React Query Hook for Projects List
 */
export function useProjects(filter: ProjectQueryFilter = {}) {
  return useQuery<PaginatedProjectsResult, Error>({
    queryKey: ['projects', filter],
    queryFn: () => fetchProjects(filter),
    staleTime: 1000 * 60 * 3,
  });
}

/**
 * React Query Hook for Single Project Detail
 */
export function useProject(idOrSlug?: string | null) {
  return useQuery<ProjectItem | null, Error>({
    queryKey: ['project', idOrSlug],
    queryFn: () => (idOrSlug ? fetchProjectById(idOrSlug) : Promise.resolve(null)),
    enabled: Boolean(idOrSlug),
    staleTime: 1000 * 60 * 3,
  });
}

/**
 * Create Project Mutation
 */
export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation<ProjectItem, Error, ProjectFormValues>({
    mutationFn: async (payload) => {
      const { data, error } = await (supabase as any)
        .from('projects')
        .insert([
          {
            name: payload.name,
            slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            description: payload.description || null,
            client_id: payload.clientId || null,
            status: payload.status || 'planning',
            priority: payload.priority || 'medium',
            start_date: payload.startDate || null,
            deadline: payload.deadline || null,
            color: payload.color || '#FAFAFA',
            thumbnail_url: payload.thumbnailUrl || null,
          },
        ])
        .select()
        .single();

      if (error) throw new Error(normalizeClientError(error, 'Create project failed'));
      return {
        id: String(data.id),
        name: String(data.name),
        slug: String(data.slug),
        status: data.status,
        priority: data.priority,
        completionPercent: Number(data.completion_percent ?? 0),
        color: data.color || '#FAFAFA',
        createdAt: String(data.created_at),
        updatedAt: String(data.updated_at),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

/**
 * Update Project Mutation
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation<ProjectItem, Error, { id: string; payload: Partial<ProjectFormValues> }>({
    mutationFn: async ({ id, payload }) => {
      const updateData: any = {};
      if (payload.name) {
        updateData.name = payload.name;
        updateData.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (payload.description !== undefined) updateData.description = payload.description || null;
      if (payload.clientId !== undefined) updateData.client_id = payload.clientId || null;
      if (payload.status) updateData.status = payload.status;
      if (payload.priority) updateData.priority = payload.priority;
      if (payload.startDate !== undefined) updateData.start_date = payload.startDate || null;
      if (payload.deadline !== undefined) updateData.deadline = payload.deadline || null;
      if (payload.color) updateData.color = payload.color;
      if (payload.thumbnailUrl !== undefined) updateData.thumbnail_url = payload.thumbnailUrl || null;
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await (supabase as any)
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(normalizeClientError(error, 'Update project failed'));
      return {
        id: String(data.id),
        name: String(data.name),
        slug: String(data.slug),
        status: data.status,
        priority: data.priority,
        completionPercent: Number(data.completion_percent ?? 0),
        color: data.color || '#FAFAFA',
        createdAt: String(data.created_at),
        updatedAt: String(data.updated_at),
      };
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

/**
 * Delete Project Mutation
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const { error } = await (supabase as any).from('projects').delete().eq('id', id);
      if (error) throw new Error(normalizeClientError(error, 'Delete project failed'));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
