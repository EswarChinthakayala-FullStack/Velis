import React from 'react';
import type { MilestoneStatus } from '../lib/types/milestone';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, Time02Icon, Flag01Icon } from '@hugeicons/core-free-icons';

interface MilestoneConnectorProps {
  status: MilestoneStatus;
  isLast?: boolean;
}

export const MilestoneConnector: React.FC<MilestoneConnectorProps> = ({
  status,
  isLast = false,
}) => {
  return (
    <div className="flex flex-col items-center shrink-0 w-8 select-none font-mono">
      {/* Node Badge */}
      <div
        className={`w-7 h-7 rounded-sm flex items-center justify-center border shadow-md transition-all ${
          status === 'completed'
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
            : status === 'in_progress'
            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse'
            : status === 'blocked'
            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
            : 'bg-zinc-900 border-zinc-800 text-zinc-500'
        }`}
      >
        {status === 'completed' ? (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
        ) : status === 'in_progress' ? (
          <HugeiconsIcon icon={Time02Icon} size={14} />
        ) : (
          <HugeiconsIcon icon={Flag01Icon} size={14} />
        )}
      </div>

      {/* Animated Vertical Line Connector */}
      {!isLast && (
        <div
          className={`w-0.5 flex-1 min-h-[40px] my-1.5 transition-colors ${
            status === 'completed'
              ? 'bg-emerald-500/40'
              : status === 'in_progress'
              ? 'bg-amber-500/40'
              : 'bg-zinc-800'
          }`}
        />
      )}
    </div>
  );
};

export default MilestoneConnector;
