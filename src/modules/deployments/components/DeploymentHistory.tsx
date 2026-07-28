import React, { useState } from 'react';
import type { DeploymentItem } from '../types/deployment';
import { HealthStatusBadge } from './DeploymentStatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Clock01Icon,
  GitBranchIcon,
  GitCommitIcon,
  RocketIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons';
import { formatDistanceToNow, parseISO, format } from 'date-fns';

interface DeploymentHistoryProps {
  deployments: DeploymentItem[];
}

export const DeploymentHistory: React.FC<DeploymentHistoryProps> = ({ deployments }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (deployments.length === 0) return null;

  const displayItems = isExpanded ? deployments : deployments.slice(0, 3);

  return (
    <div className="rounded-lg bg-[#0c0c0e]/90 border border-zinc-800/80 p-4 sm:p-5 font-mono select-none space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
            <HugeiconsIcon icon={Clock01Icon} size={15} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-sans tracking-tight">Deployment History</h3>
            <p className="text-[10px] text-zinc-500 font-mono">
              Timeline of version releases across environments.
            </p>
          </div>
        </div>

        {deployments.length > 3 && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 px-2.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Show Less' : `View All (${deployments.length})`}</span>
            <HugeiconsIcon icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon} size={12} />
          </button>
        )}
      </div>

      <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
        {displayItems.map((item) => {
          let dateStr = item.deployedAt;
          try {
            const parsed = parseISO(item.deployedAt);
            dateStr = `${format(parsed, 'MMM d, yyyy HH:mm')} (${formatDistanceToNow(parsed, { addSuffix: true })})`;
          } catch {
            // Keep raw
          }

          return (
            <div key={item.id} className="relative flex items-start justify-between gap-3 text-xs">
              <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-800 border-2 border-[#0c0c0e]" />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white font-sans">{item.version || 'v1.0.0'}</span>
                  <span className="px-2 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono capitalize">
                    {item.environment}
                  </span>
                  {item.provider && (
                    <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-500 font-mono uppercase">
                      {item.provider}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                  {item.branch && (
                    <span className="inline-flex items-center gap-1">
                      <HugeiconsIcon icon={GitBranchIcon} size={11} className="text-zinc-500" />
                      <span>{item.branch}</span>
                    </span>
                  )}
                  {item.commitSha && (
                    <span className="inline-flex items-center gap-1 font-mono">
                      <HugeiconsIcon icon={GitCommitIcon} size={11} className="text-zinc-500" />
                      <span>{item.commitSha.substring(0, 7)}</span>
                    </span>
                  )}
                  <span className="text-zinc-500">{dateStr}</span>
                </div>
              </div>

              <div className="shrink-0">
                <HealthStatusBadge status={item.healthStatus} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
