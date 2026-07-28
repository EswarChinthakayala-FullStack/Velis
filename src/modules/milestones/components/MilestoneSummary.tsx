import React from 'react';
import type { MilestoneSummaryStats } from '../lib/types/milestone';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Flag01Icon,
  CheckmarkCircle02Icon,
  Time02Icon,
  ProgressIcon,
} from '@hugeicons/core-free-icons';

interface MilestoneSummaryProps {
  stats: MilestoneSummaryStats;
}

export const MilestoneSummary: React.FC<MilestoneSummaryProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono select-none">
      {/* 1. Total Milestones */}
      <div className="p-3.5 rounded-sm bg-[#0c0c0e]/90 border border-zinc-800/90 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] text-zinc-400 font-semibold uppercase">Total Milestones</p>
          <p className="text-lg font-bold text-white">{stats.total}</p>
        </div>
        <div className="p-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400">
          <HugeiconsIcon icon={Flag01Icon} size={16} />
        </div>
      </div>

      {/* 2. Completed */}
      <div className="p-3.5 rounded-sm bg-[#0c0c0e]/90 border border-zinc-800/90 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] text-zinc-400 font-semibold uppercase">Completed</p>
          <p className="text-lg font-bold text-emerald-400">{stats.completed}</p>
        </div>
        <div className="p-2 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
        </div>
      </div>

      {/* 3. In Progress */}
      <div className="p-3.5 rounded-sm bg-[#0c0c0e]/90 border border-zinc-800/90 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] text-zinc-400 font-semibold uppercase">In Progress</p>
          <p className="text-lg font-bold text-amber-400">{stats.inProgress}</p>
        </div>
        <div className="p-2 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <HugeiconsIcon icon={Time02Icon} size={16} />
        </div>
      </div>

      {/* 4. Overall Progress */}
      <div className="p-3.5 rounded-sm bg-[#0c0c0e]/90 border border-zinc-800/90 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] text-zinc-400 font-semibold uppercase">Roadmap Completion</p>
          <p className="text-lg font-bold text-white">{stats.overallProgress}%</p>
        </div>
        <div className="p-2 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300">
          <HugeiconsIcon icon={ProgressIcon} size={16} />
        </div>
      </div>
    </div>
  );
};

export default MilestoneSummary;
