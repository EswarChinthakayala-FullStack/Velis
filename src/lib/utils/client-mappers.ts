import type { ClientRecord, ClientProject } from '../../types/client';

/**
 * Enterprise Client Row Mapper
 * Maps raw PostgREST rows into clean, strongly-typed domain model objects.
 */
export function mapSupabaseRowToClient(row: any): ClientRecord {
  const projects = Array.isArray(row.projects) ? row.projects : [];
  
  // Count projects that are active, in progress, planning, or on hold as open project deliverables
  const activeProjectsCount = projects.filter(
    (p: any) =>
      p.status === 'active' ||
      p.status === 'in_progress' ||
      p.status === 'planning' ||
      p.status === 'on_hold'
  ).length;

  // A client is active if they have active/planning projects OR if they are a registered client account
  const isClientActive =
    activeProjectsCount > 0 ||
    projects.length > 0 ||
    row.status === 'active' ||
    Boolean(row.email || row.company || row.id);

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
    socialLinks: row.social_links && typeof row.social_links === 'object' ? row.social_links : undefined,
    activeProjectsCount: activeProjectsCount || projects.length,
    status: isClientActive ? 'active' : 'inactive',
    createdAt: String(row.created_at),
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export function mapSupabaseRowToProject(p: any): ClientProject {
  return {
    id: String(p.id),
    name: String(p.name),
    slug: String(p.slug || p.id),
    description: p.description ? String(p.description) : undefined,
    status: p.status || 'planning',
    priority: p.priority || 'medium',
    completionPercent: Number(p.completion_percent ?? 0),
    color: p.color ? String(p.color) : '#FAFAFA',
    startDate: p.start_date ? String(p.start_date) : undefined,
    deadline: p.deadline ? String(p.deadline) : undefined,
    updatedAt: String(p.updated_at || new Date().toISOString()),
  };
}
