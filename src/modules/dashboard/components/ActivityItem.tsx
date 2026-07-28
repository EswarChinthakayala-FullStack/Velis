import React from 'react';
import { motion } from 'framer-motion';
import { ActivityIcon } from './ActivityIcon';
import type { ActivityRecord } from '../hooks/useRecentActivity';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface ActivityItemProps {
  item: ActivityRecord;
  onSelectEntity?: (entityType: string, entityId?: string) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ item, onSelectEntity }) => {
  // Format relative timestamp safely using date-fns
  const formatTime = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="flex items-center gap-3.5 p-3 rounded-lg bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800/40 hover:border-zinc-700/60 transition-colors select-none group"
    >
      {/* Icon Container */}
      <ActivityIcon entityType={item.entityType} />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-zinc-300">
          <span className="font-bold text-white">{item.actorName}</span>
          <span className="text-zinc-400 font-mono text-[11px]">{item.action}</span>
          <button
            onClick={() => onSelectEntity?.(item.entityType, item.entityId)}
            className="font-semibold text-zinc-100 hover:text-white hover:underline truncate cursor-pointer text-left"
          >
            {item.entityName}
          </button>
        </div>

        {item.projectName && (
          <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">
            Project: {item.projectName}
          </p>
        )}
      </div>

      {/* Relative Timestamp */}
      <span className="text-[10px] font-mono text-zinc-500 shrink-0">
        {formatTime(item.createdAt)}
      </span>
    </motion.div>
  );
};

export default ActivityItem;
