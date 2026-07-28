import { supabase } from '../client';
import type { ProjectItem, ProjectQueryFilter, PaginatedProjectsResult } from '../../../types/project';

/**
 * Enterprise ProjectRepository Layer
 * Encapsulates all Supabase queries, RPC calls, and mutations for Projects.
 * React components NEVER invoke Supabase directly.
 */

const PROJECT_SELECT_COLUMNS =
  'id, client_id, name, slug, description, status, priority, start_date, deadline, completion_percent, color, thumbnail_url, budget, created_at, updated_at, clients(id, name, company)';

function mapRowToProject(row: any): ProjectItem {
  const clientData = row.clients;

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
    technologies: [],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at || row.created_at),
  };
}

export const ProjectRepository = {
  /**
   * Fetch paginated projects with optional filters
   */
  async getProjects(filter: ProjectQueryFilter = {}): Promise<PaginatedProjectsResult> {
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
      throw new Error(error.message);
    }

    const rawProjects = data || [];
    const totalCount = count ?? rawProjects.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return {
      projects: rawProjects.map(mapRowToProject),
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Fetch single project by ID or Slug
   */
  async getProjectBySlugOrId(identifier: string): Promise<ProjectItem> {
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
      throw new Error(error.message);
    }

    return mapRowToProject(data);
  },

  /**
   * Fetch Dashboard KPIs via PostgreSQL RPC function
   */
  async getDashboardKPIs() {
    const { data, error } = await (supabase as any).rpc('get_dashboard_kpis');
    if (error) {
      return {
        total_projects: 0,
        active_projects: 0,
        completed_projects: 0,
        on_hold_projects: 0,
        overdue_tasks: 0,
        active_clients: 0,
        active_share_links: 0,
      };
    }
    return data;
  },
};
