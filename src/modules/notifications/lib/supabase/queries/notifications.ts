import { supabase } from '../../../../../lib/supabase';
import type {
  NotificationItem,
  NotificationSummary,
  NotificationFilterState,
  NotificationPreferences,
} from '../../../types/notification';

const NOTIFICATION_SELECT_COLUMNS =
  'id, category, type, title, description, priority, read_status, archived, entity_type, entity_id, project_id, client_id, metadata, created_at';

// 1. Fetch Filtered Notifications List from Supabase DB
export async function fetchNotifications(filters: NotificationFilterState): Promise<NotificationItem[]> {
  try {
    let query = (supabase as any)
      .from('notifications')
      .select(NOTIFICATION_SELECT_COLUMNS);

    // Apply Filter Tab
    if (filters.tab === 'unread') {
      query = query.eq('read_status', false).eq('archived', false);
    } else if (filters.tab === 'read') {
      query = query.eq('read_status', true).eq('archived', false);
    } else if (filters.tab === 'archived') {
      query = query.eq('archived', true);
    } else {
      query = query.eq('archived', false);
    }

    // Apply Category Filter
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Apply Type Filter
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }

    // Apply Priority Filter
    if (filters.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }

    // Apply Sort Order
    const isAscending = filters.sort === 'oldest';
    query = query.order('created_at', { ascending: isAscending }).limit(100);

    const { data, error } = await query;

    if (error) {
      console.warn('fetchNotifications DB error:', error.message);
      return [];
    }

    let items: NotificationItem[] = (data || []).map((row: any) => ({
      id: row.id,
      category: row.category,
      type: row.type || 'info',
      title: row.title,
      description: row.description || '',
      priority: row.priority || 'medium',
      readStatus: Boolean(row.read_status),
      archived: Boolean(row.archived),
      entityType: row.entity_type,
      entityId: row.entity_id,
      projectId: row.project_id,
      clientId: row.client_id,
      metadata: row.metadata || {},
      createdAt: row.created_at,
    }));

    // Apply Client Search Filter
    if (filters.search && filters.search.trim().length > 0) {
      const term = filters.search.toLowerCase().trim();
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(term) ||
          (n.description && n.description.toLowerCase().includes(term)) ||
          n.category.toLowerCase().includes(term)
      );
    }

    return items;
  } catch (err: any) {
    console.warn('fetchNotifications exception:', err?.message || err);
    return [];
  }
}

// 2. Fetch Unread Notifications Count
export async function fetchUnreadCount(): Promise<number> {
  try {
    const { count, error } = await (supabase as any)
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('read_status', false)
      .eq('archived', false);

    if (error) return 0;
    return count || 0;
  } catch (err) {
    return 0;
  }
}

// 3. Fetch Notification Summary Metrics
export async function fetchNotificationSummary(): Promise<NotificationSummary> {
  try {
    const { data, error } = await (supabase as any)
      .from('notifications')
      .select('category, read_status, priority')
      .eq('archived', false);

    if (error || !data) {
      return {
        totalCount: 0,
        unreadCount: 0,
        highPriorityCount: 0,
        categoryCounts: {} as any,
      };
    }

    let unreadCount = 0;
    let highPriorityCount = 0;
    const categoryCounts: Record<string, number> = {};

    data.forEach((row: any) => {
      if (!row.read_status) unreadCount++;
      if (row.priority === 'high' || row.priority === 'urgent') highPriorityCount++;
      categoryCounts[row.category] = (categoryCounts[row.category] || 0) + 1;
    });

    return {
      totalCount: data.length,
      unreadCount,
      highPriorityCount,
      categoryCounts: categoryCounts as any,
    };
  } catch (err) {
    return {
      totalCount: 0,
      unreadCount: 0,
      highPriorityCount: 0,
      categoryCounts: {} as any,
    };
  }
}

// 4. Mark Single Notification Read/Unread
export async function markNotificationRead(id: string, readStatus: boolean): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from('notifications')
      .update({ read_status: readStatus })
      .eq('id', id);

    return !error;
  } catch (err) {
    return false;
  }
}

// 5. Mark All Notifications as Read
export async function markAllNotificationsRead(): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from('notifications')
      .update({ read_status: true })
      .eq('read_status', false);

    return !error;
  } catch (err) {
    return false;
  }
}

// 6. Archive Notification
export async function archiveNotification(id: string, archived: boolean = true): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from('notifications')
      .update({ archived })
      .eq('id', id);

    return !error;
  } catch (err) {
    return false;
  }
}

// 7. Delete Notification permanently
export async function deleteNotification(id: string): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from('notifications')
      .delete()
      .eq('id', id);

    return !error;
  } catch (err) {
    return false;
  }
}

// 8. Fetch Notification Preferences
export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) {
      return defaultPreferences;
    }

    const { data, error } = await (supabase as any)
      .from('notification_preferences')
      .select('projects_enabled, clients_enabled, timeline_enabled, github_enabled, deployments_enabled, payments_enabled, share_links_enabled, notes_enabled, changelog_enabled, security_enabled, system_enabled')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return defaultPreferences;

    return {
      projectsEnabled: Boolean(data.projects_enabled),
      clientsEnabled: Boolean(data.clients_enabled),
      timelineEnabled: Boolean(data.timeline_enabled),
      githubEnabled: Boolean(data.github_enabled),
      deploymentsEnabled: Boolean(data.deployments_enabled),
      paymentsEnabled: Boolean(data.payments_enabled),
      shareLinksEnabled: Boolean(data.share_links_enabled),
      notesEnabled: Boolean(data.notes_enabled),
      changelogEnabled: Boolean(data.changelog_enabled),
      securityEnabled: Boolean(data.security_enabled),
      systemEnabled: Boolean(data.system_enabled),
    };
  } catch (err) {
    return defaultPreferences;
  }
}

const defaultPreferences: NotificationPreferences = {
  projectsEnabled: true,
  clientsEnabled: true,
  timelineEnabled: true,
  githubEnabled: true,
  deploymentsEnabled: true,
  paymentsEnabled: true,
  shareLinksEnabled: true,
  notesEnabled: true,
  changelogEnabled: true,
  securityEnabled: true,
  systemEnabled: true,
};
