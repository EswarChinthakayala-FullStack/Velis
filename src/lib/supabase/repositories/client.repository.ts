import { supabase } from '../client';
import type { ClientRecord, ClientQueryFilter, PaginatedClientsResult } from '../../../types/client';

const CLIENT_COLUMNS =
  'id, name, company, email, phone, country, timezone, website, notes, github_username, social_links, created_at, updated_at';

function mapRowToClient(row: any): ClientRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    company: row.company ? String(row.company) : undefined,
    email: row.email ? String(row.email) : undefined,
    phone: row.phone ? String(row.phone) : undefined,
    country: row.country ? String(row.country) : undefined,
    timezone: row.timezone ? String(row.timezone) : undefined,
    website: row.website ? String(row.website) : undefined,
    notes: row.notes ? String(row.notes) : undefined,
    githubUsername: row.github_username ? String(row.github_username) : undefined,
    socialLinks: row.social_links && typeof row.social_links === 'object' ? row.social_links : {},
    activeProjectsCount: Array.isArray(row.projects) ? row.projects.length : 0,
    status: (row.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at || row.created_at),
  };
}

export const ClientRepository = {
  async getClients(filter: ClientQueryFilter = {}): Promise<PaginatedClientsResult> {
    const {
      search = '',
      page = 1,
      pageSize = 20,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = filter;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = (supabase as any)
      .from('clients')
      .select(CLIENT_COLUMNS, { count: 'exact' });

    if (search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`name.ilike.${term},company.ilike.${term},email.ilike.${term}`);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    const rawClients = data || [];
    const totalCount = count ?? rawClients.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return {
      clients: rawClients.map(mapRowToClient),
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  },
};
