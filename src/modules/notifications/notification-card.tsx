import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Folder01Icon,
  UserGroupIcon,
  Clock01Icon,
  GitBranchIcon,
  RocketIcon,
  MoneyBagIcon,
  StickyNote01Icon,
  Tag01Icon,
  ShieldKeyIcon,
  Settings01Icon,
  CloudIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Cancel01Icon,
  ArchiveIcon,
  Delete02Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import type { NotificationItem, NotificationCategory } from './types/notification';

interface NotificationCardProps {
  notification: NotificationItem;
  onSelect: (notification: NotificationItem) => void;
  onMarkRead: (id: string, readStatus: boolean) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_ICONS: Record<NotificationCategory, any> = {
  projects: Folder01Icon,
  clients: UserGroupIcon,
  timeline: Clock01Icon,
  github: GitBranchIcon,
  deployments: RocketIcon,
  payments: MoneyBagIcon,
  notes: StickyNote01Icon,
  changelog: Tag01Icon,
  share_links: ShieldKeyIcon,
  security: ShieldKeyIcon,
  authentication: ShieldKeyIcon,
  system: Settings01Icon,
  storage: CloudIcon,
  backup: Settings01Icon,
  settings: Settings01Icon,
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onSelect,
  onMarkRead,
  onArchive,
  onDelete,
}) => {
  const IconComponent = CATEGORY_ICONS[notification.category] || Folder01Icon;

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(notification)}
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer font-mono select-none ${
        !notification.readStatus
          ? 'bg-zinc-900/70 border-zinc-700/80 shadow-md'
          : 'bg-[#0a0a0c]/80 border-zinc-800/60 hover:bg-zinc-900/40 hover:border-zinc-700/60'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Category Icon Badge */}
        <div
          className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
            !notification.readStatus
              ? 'bg-zinc-800 border-zinc-700 text-white'
              : 'bg-zinc-950 border-zinc-800 text-zinc-400 group-hover:text-zinc-200'
          }`}
        >
          <HugeiconsIcon icon={IconComponent} size={18} />
        </div>

        {/* Card Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              {/* Category Pill */}
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                {notification.category.replace('_', ' ')}
              </span>

              {/* Priority Indicator */}
              {notification.priority === 'urgent' || notification.priority === 'high' ? (
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  {notification.priority}
                </span>
              ) : null}

              {/* Unread Pulse Dot */}
              {!notification.readStatus && (
                <span className="w-2 h-2 rounded-full bg-white shadow-glow animate-pulse" />
              )}
            </div>

            {/* Relative Timestamp */}
            <span className="text-[11px] text-zinc-500 font-mono shrink-0">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>

          {/* Title & Description */}
          <h4
            className={`text-xs font-bold font-sans mt-1.5 truncate ${
              !notification.readStatus ? 'text-white' : 'text-zinc-300'
            }`}
          >
            {notification.title}
          </h4>

          {notification.description && (
            <p className="text-[11px] text-zinc-400 font-mono leading-relaxed mt-1 line-clamp-2">
              {notification.description}
            </p>
          )}
        </div>

        {/* Hover Quick Actions */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition-opacity"
        >
          <button
            type="button"
            title={notification.readStatus ? 'Mark as Unread' : 'Mark as Read'}
            onClick={() => onMarkRead(notification.id, !notification.readStatus)}
            className="w-7 h-7 rounded-md bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={notification.readStatus ? Cancel01Icon : CheckmarkCircle02Icon} size={14} />
          </button>

          <button
            type="button"
            title="Archive Notification"
            onClick={() => onArchive(notification.id)}
            className="w-7 h-7 rounded-md bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={ArchiveIcon} size={14} />
          </button>

          <button
            type="button"
            title="Delete Notification"
            onClick={() => onDelete(notification.id)}
            className="w-7 h-7 rounded-md bg-zinc-950 border border-zinc-800 hover:border-red-900/80 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
