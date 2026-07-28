import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { NotificationCard } from './notification-card';
import type { NotificationItem } from './types/notification';

interface NotificationGroupProps {
  title: string;
  count: number;
  notifications: NotificationItem[];
  defaultExpanded?: boolean;
  onSelect: (notification: NotificationItem) => void;
  onMarkRead: (id: string, readStatus: boolean) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationGroup: React.FC<NotificationGroupProps> = ({
  title,
  count,
  notifications,
  defaultExpanded = true,
  onSelect,
  onMarkRead,
  onArchive,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (notifications.length === 0) return null;

  return (
    <div className="space-y-2 select-none font-mono">
      {/* Group Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-1.5 px-1 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={isExpanded ? ArrowDown01Icon : ArrowRight01Icon}
            size={14}
            className="text-zinc-500"
          />
          <span className="font-sans uppercase tracking-wider text-[11px]">{title}</span>
          <span className="px-2 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
            {count}
          </span>
        </div>
      </button>

      {/* Group Cards Container */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-2.5"
          >
            {notifications.map((item) => (
              <NotificationCard
                key={item.id}
                notification={item}
                onSelect={onSelect}
                onMarkRead={onMarkRead}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
