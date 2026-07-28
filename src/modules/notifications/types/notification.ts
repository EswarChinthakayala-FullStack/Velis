export type NotificationCategory =
  | 'projects'
  | 'clients'
  | 'timeline'
  | 'github'
  | 'deployments'
  | 'payments'
  | 'notes'
  | 'changelog'
  | 'share_links'
  | 'security'
  | 'authentication'
  | 'system'
  | 'storage'
  | 'backup'
  | 'settings';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationItem {
  id: string;
  userId?: string;
  category: NotificationCategory;
  type: NotificationType;
  title: string;
  description?: string;
  priority: NotificationPriority;
  readStatus: boolean;
  archived: boolean;
  entityType?: string;
  entityId?: string;
  projectId?: string;
  clientId?: string;
  actorId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NotificationSummary {
  totalCount: number;
  unreadCount: number;
  highPriorityCount: number;
  categoryCounts: Record<NotificationCategory, number>;
}

export interface NotificationFilterState {
  search: string;
  tab: 'all' | 'unread' | 'read' | 'archived';
  category: 'all' | NotificationCategory;
  priority: 'all' | NotificationPriority;
  type: 'all' | NotificationType;
  sort: 'newest' | 'oldest';
}

export interface NotificationPreferences {
  projectsEnabled: boolean;
  clientsEnabled: boolean;
  timelineEnabled: boolean;
  githubEnabled: boolean;
  deploymentsEnabled: boolean;
  paymentsEnabled: boolean;
  shareLinksEnabled: boolean;
  notesEnabled: boolean;
  changelogEnabled: boolean;
  securityEnabled: boolean;
  systemEnabled: boolean;
}
