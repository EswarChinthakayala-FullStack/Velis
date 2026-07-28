import type {
  ProjectProgress,
  MonthlyCompletion,
  TechnologyUsage,
  ClientDistribution,
  RecentActivityItem,
} from '../../../types/dashboard';

export function transformProjectProgress(rows: any[]): ProjectProgress[] {
  return (rows || []).map((row) => ({
    id: String(row.id),
    name: String(row.name || 'Untitled Project'),
    completionPercent: Number(row.completion_percent ?? 0),
    color: String(row.color || '#FAFAFA'),
  }));
}

export function transformMonthlyCompletions(rows: any[]): MonthlyCompletion[] {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const monthBuckets: Record<string, number> = {};
  const bucketOrder: string[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
    monthBuckets[label] = 0;
    bucketOrder.push(label);
  }

  (rows || []).forEach((row) => {
    if (row.updated_at) {
      const date = new Date(row.updated_at);
      const label = `${monthNames[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`;
      if (monthBuckets[label] !== undefined) {
        monthBuckets[label] += 1;
      }
    }
  });

  return bucketOrder.map((label) => ({
    month: label,
    completedCount: monthBuckets[label] || 0,
  }));
}

export function transformTechnologyUsage(rows: any[]): TechnologyUsage[] {
  const techCounts: Record<string, number> = {};

  (rows || []).forEach((row) => {
    if (row.name) {
      techCounts[row.name] = (techCounts[row.name] || 0) + 1;
    }
  });

  return Object.entries(techCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function transformClientDistribution(rows: any[]): ClientDistribution[] {
  const clientCounts: Record<string, number> = {};

  (rows || []).forEach((row) => {
    const clientName = row.clients?.name || 'Unassigned / Direct';
    clientCounts[clientName] = (clientCounts[clientName] || 0) + 1;
  });

  return Object.entries(clientCounts)
    .map(([clientName, projectCount]) => ({ clientName, projectCount }))
    .sort((a, b) => b.projectCount - a.projectCount);
}

export function transformRecentActivity(rows: any[]): RecentActivityItem[] {
  return (rows || []).map((row) => {
    const profile = row.profiles;
    const metadata = row.metadata || {};
    const actorName = profile?.full_name || metadata.actor_name || 'System User';
    const entityName = metadata.entity_name || metadata.title || row.entity_type || 'Workspace Item';

    return {
      id: String(row.id),
      actorId: row.actor_id ? String(row.actor_id) : undefined,
      actorName: String(actorName),
      actorAvatar: profile?.avatar_url || metadata.actor_avatar,
      action: String(row.action),
      entityType: String(row.entity_type),
      entityId: row.entity_id ? String(row.entity_id) : undefined,
      entityName: String(entityName),
      projectName: metadata.project_name ? String(metadata.project_name) : undefined,
      createdAt: String(row.created_at),
    };
  });
}
