import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { RefreshIcon } from '@hugeicons/core-free-icons';

interface ChartCardProps {
  title: string;
  description?: string;
  onRefresh?: () => void;
  children: React.ReactNode;
  badge?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  onRefresh,
  children,
  badge,
}) => {
  return (
    <div className="p-5 bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <h3 className="text-sm font-bold text-white tracking-tight truncate">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-zinc-400 font-mono truncate">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {badge && (
            <span className="px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
              {badge}
            </span>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
              title="Refresh Chart Data"
            >
              <HugeiconsIcon icon={RefreshIcon} size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Chart Body */}
      <div className="w-full flex-1">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
