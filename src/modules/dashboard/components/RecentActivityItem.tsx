import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import type { ActivityItem } from '../types';

interface RecentActivityItemProps {
  item: ActivityItem;
}

export const RecentActivityItem: React.FC<RecentActivityItemProps> = ({ item }) => {
  const IconComponent = item.icon;

  return (
    <motion.div
      whileHover={{ x: 2 }}
      transition={{ duration: 0.12 }}
      className="flex items-start gap-3.5 p-3 rounded-lg bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800/40 hover:border-zinc-700/60 transition-colors"
    >
      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white shrink-0">
        <HugeiconsIcon icon={IconComponent} size={16} className="text-zinc-300" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-white truncate">
            {item.title}
          </p>
          <span className="text-[10px] font-mono text-zinc-400 shrink-0">
            {item.timestamp}
          </span>
        </div>

        <p className="text-[11px] text-zinc-400 font-mono truncate mt-0.5">
          {item.projectName}
        </p>
      </div>
    </motion.div>
  );
};

export default RecentActivityItem;
