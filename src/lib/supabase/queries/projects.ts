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
 * Enterprise Projects Data Access Layer (PHASE 07)
 * Single source of truth for all project queries and CRUD mutations.
 * Pure data layer: ZERO mock data, ZERO SELECT * queries.
 */

const PROJECT_SELECT_COLUMNS =
  'id, client_id, name, slug, description, status, priority, start_date, deadline, completion_percent, color, thumbnail_url, created_at, updated_at';

function mapRowToProject(row: any): ProjectItem {
  const clientData = row.clients;
  const techData = Array.isArray(row.project_technologies) ? row.project_technologies : [];
  const repoData = Array.isArray(row.github_repositories) && row.github_repositories.length > 0
    ? row.github_repositories[0]
    : undefined;

  return {
    id: String(row.id),
    clientId: row.client_id ? String(row.client_id) : undefined,
    clientName: clientData?.name ? String(clientData.name) : undefined,
    clientCompany: clientData?.company ? String(clientData.company) : undefined,
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
    technologies: techData.map((t: any) => ({
      id: String(t.id),
      name: String(t.name),
      iconUrl: t.icon_url ? String(t.icon_url) : undefined,
    })),
    githubRepo: repoData
      ? {
          id: String(repoData.id),
          repoUrl: String(repoData.repo_url),
          organization: repoData.organization ? String(repoData.organization) : undefined,
          branch: repoData.branch ? String(repoData.branch) : 'main',
          visibility: repoData.visibility || 'private',
          openIssues: Number(repoData.open_issues || 0),
          openPrs: Number(repoData.open_prs || 0),
          lastSyncedAt: repoData.last_synced_at ? String(repoData.last_synced_at) : undefined,
        }
      : undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at || row.created_at),
  };
}

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

    // Secondary client lookup to keep URL query strings short
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
        // Fallback
      }
    }

    const projects = rawProjects.map((row: any) => {
      const clientInfo = row.client_id ? clientMap[String(row.client_id)] : undefined;
      return mapRowToProject({
        ...row,
        clients: clientInfo ? { name: clientInfo.name, company: clientInfo.company } : undefined,
      });
    });

    return {
      projects,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function fetchProjectBySlugOrId(identifier: string): Promise<ProjectItem> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier.trim());

    let query = (supabase as any)
      .from('projects')
      .select(PROJECT_SELECT_COLUMNS);

    if (isUuid) {
      query = query.eq('id', identifier.trim());
    } else {
      query = query.eq('slug', identifier.trim());
    }

    const { data, error } = await query.single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapRowToProject(data);
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export const fetchProjectById = fetchProjectBySlugOrId;

export async function createProjectRecord(input: ProjectFormValues): Promise<ProjectItem> {
  try {
    let userId: string | undefined;

    try {
      const { data: userRes } = await supabase.auth.getUser();
      userId = userRes?.user?.id;
    } catch {
      // Ignore
    }

    if (!userId) {
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('id')
        .limit(1)
        .maybeSingle();
      userId = profile?.id;
    }

    if (!userId) {
      throw new Error('Authentication required to create a project');
    }

    const slugified = input.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const uniqueSlug = `${slugified}-${Date.now().toString(36)}`;

    const { data, error } = await (supabase as any)
      .from('projects')
      .insert({
        created_by: userId,
        client_id: input.clientId || null,
        name: input.name,
        slug: uniqueSlug,
        description: input.description || null,
        status: input.status,
        priority: input.priority,
        start_date: input.startDate || null,
        deadline: input.deadline || null,
        completion_percent: input.completionPercent ?? 0,
        color: input.color || '#FAFAFA',
        thumbnail_url: input.thumbnailUrl || null,
      })
      .select(PROJECT_SELECT_COLUMNS)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapRowToProject(data);
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function updateProjectRecord(
  projectId: string,
  input: Partial<ProjectFormValues>
): Promise<ProjectItem> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) updateData.name = input.name;
    if (input.clientId !== undefined) updateData.client_id = input.clientId || null;
    if (input.description !== undefined) updateData.description = input.description || null;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.startDate !== undefined) updateData.start_date = input.startDate || null;
    if (input.deadline !== undefined) updateData.deadline = input.deadline || null;
    if (input.completionPercent !== undefined) updateData.completion_percent = input.completionPercent;
    if (input.color !== undefined) updateData.color = input.color || '#FAFAFA';
    if (input.thumbnailUrl !== undefined) updateData.thumbnail_url = input.thumbnailUrl || null;

    const { data, error } = await (supabase as any)
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select(PROJECT_SELECT_COLUMNS)
      .single();

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }

    return mapRowToProject(data);
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

export async function deleteProjectRecord(projectId: string): Promise<void> {
  try {
    const { error } = await (supabase as any)
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }
  } catch (err: any) {
    const normalized = normalizeClientError(err);
    throw new Error(normalized.message);
  }
}

// --- Reusable React Query Hooks ---

export function useProjects(filter: ProjectQueryFilter = {}) {
  return useQuery<PaginatedProjectsResult, Error>({
    queryKey: ['projects', filter],
    queryFn: () => fetchProjects(filter),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

export function useProject(id?: string) {
  return useQuery<ProjectItem, Error>({
    queryKey: ['project-details', id],
    queryFn: () => {
      if (!id) throw new Error('Project ID is required');
      return fetchProjectById(id);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 3,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation<ProjectItem, Error, ProjectFormValues>({
    mutationFn: (input) => createProjectRecord(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation<ProjectItem, Error, { id: string; values: Partial<ProjectFormValues> }>({
    mutationFn: ({ id, values }) => updateProjectRecord(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-details', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteProjectRecord(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-details', id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export async function connectProjectGithubRepo(
  projectId: string,
  repoUrl: string
): Promise<void> {
  const cleanUrl = repoUrl.trim();
  if (!cleanUrl || !projectId) return;

  let organization: string | undefined;
  try {
    const parsed = new URL(cleanUrl);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      organization = parts[0];
    }
  } catch {
    // Ignore invalid url parse
  }

  const { data: existing } = await (supabase as any)
    .from('github_repositories')
    .select('id')
    .eq('project_id', projectId)
    .maybeSingle();

  if (existing) {
    const { error } = await (supabase as any)
      .from('github_repositories')
      .update({
        repo_url: cleanUrl,
        organization: organization || null,
        last_synced_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }
  } else {
    const { error } = await (supabase as any)
      .from('github_repositories')
      .insert({
        project_id: projectId,
        repo_url: cleanUrl,
        organization: organization || null,
        branch: 'main',
        visibility: 'private',
      });

    if (error) {
      const normalized = normalizeClientError(error);
      throw new Error(normalized.message);
    }
  }
}

export function useConnectProjectGithubRepo() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { projectId: string; repoUrl: string }>({
    mutationFn: ({ projectId, repoUrl }) => connectProjectGithubRepo(projectId, repoUrl),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-details', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
