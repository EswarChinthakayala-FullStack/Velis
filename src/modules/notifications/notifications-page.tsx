import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from './hooks/useNotifications';
import { useMarkNotificationRead } from './hooks/useMarkNotificationRead';
import { useArchiveNotification } from './hooks/useArchiveNotification';
import { useDeleteNotification } from './hooks/useDeleteNotification';
import { useNotificationRealtime } from './hooks/useNotificationRealtime';

import { NotificationToolbar } from './notification-toolbar';
import { NotificationGroup } from './notification-groups';
import { NotificationDetailSheet } from './notification-detail-sheet';
import { NotificationEmptyState } from './notification-empty';
import type { NotificationFilterState, NotificationItem } from './types/notification';
import { RadialSpinner } from '../projects/components/RadialSpinner';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  // Enable Realtime WebSocket Updates
  useNotificationRealtime();

  // Filter State
  const [filters, setFilters] = useState<NotificationFilterState>({
    search: '',
    tab: 'all',
    category: 'all',
    priority: 'all',
    type: 'all',
    sort: 'newest',
  });

  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  // Single query — derive unread count from this list instead of separate queries
  const { data: notifications = [], isLoading, refetch } = useNotifications(filters);
  const { markSingle, markAll } = useMarkNotificationRead();
  const archiveMutation = useArchiveNotification();
  const deleteMutation = useDeleteNotification();

  // Derive unread count from list data (no extra query)
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.readStatus).length,
    [notifications]
  );

  const handleFilterChange = (updated: Partial<NotificationFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleMarkRead = (id: string, readStatus: boolean) => {
    markSingle.mutate({ id, readStatus });
  };

  const handleArchive = (id: string) => {
    archiveMutation.mutate({ id });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Group notifications into Today, Yesterday, Earlier
  const { todayNotifications, yesterdayNotifications, earlierNotifications } = useMemo(() => {
    const today: NotificationItem[] = [];
    const yesterday: NotificationItem[] = [];
    const earlier: NotificationItem[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

    notifications.forEach((item) => {
      const itemTime = new Date(item.createdAt).getTime();
      if (itemTime >= todayStart) {
        today.push(item);
      } else if (itemTime >= yesterdayStart) {
        yesterday.push(item);
      } else {
        earlier.push(item);
      }
    });

    return { todayNotifications: today, yesterdayNotifications: yesterday, earlierNotifications: earlier };
  }, [notifications]);

  return (
    <div className="space-y-6 font-mono select-none pb-20 max-w-7xl mx-auto">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight font-sans">
              Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-white text-black font-bold text-[11px] font-mono shadow">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Centralized activity stream and event monitoring across projects, clients, and infrastructure.
          </p>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <NotificationToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onMarkAllRead={() => markAll.mutate()}
        onOpenSettings={() => navigate('/app/settings?tab=notifications')}
        onRefresh={() => refetch()}
        isMarkingAllPending={markAll.isPending}
      />

      {/* Main Notifications Stream */}
      {isLoading ? (
        <div className="p-12 rounded-xl bg-zinc-950/40 border border-zinc-800/40 h-64 flex items-center justify-center">
          <RadialSpinner size={28} className="text-zinc-500" />
        </div>
      ) : notifications.length === 0 ? (
        <NotificationEmptyState
          onRefresh={() => refetch()}
          onOpenSettings={() => navigate('/app/settings?tab=notifications')}
        />
      ) : (
        <div className="space-y-6 pt-2">
          <NotificationGroup
            title="Today"
            count={todayNotifications.length}
            notifications={todayNotifications}
            onSelect={setSelectedNotification}
            onMarkRead={handleMarkRead}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />

          <NotificationGroup
            title="Yesterday"
            count={yesterdayNotifications.length}
            notifications={yesterdayNotifications}
            onSelect={setSelectedNotification}
            onMarkRead={handleMarkRead}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />

          <NotificationGroup
            title="Earlier This Month"
            count={earlierNotifications.length}
            notifications={earlierNotifications}
            onSelect={setSelectedNotification}
            onMarkRead={handleMarkRead}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Detail Drawer */}
      <NotificationDetailSheet
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onMarkRead={handleMarkRead}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default NotificationsPage;
