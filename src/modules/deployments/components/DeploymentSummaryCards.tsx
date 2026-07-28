import React from 'react';
import type { DeploymentSummary } from '../types/deployment';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  RocketIcon,
  FolderCodeIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
} from '@hugeicons/core-free-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface DeploymentSummaryCardsProps {
  summary: DeploymentSummary;
}

export const DeploymentSummaryCards: React.FC<DeploymentSummaryCardsProps> = ({ summary }) => {
  let relativeTime = 'No deployments yet';
  if (summary.lastSuccessfulDeploy) {
    try {
      relativeTime = formatDistanceToNow(parseISO(summary.lastSuccessfulDeploy), {
        addSuffix: true,
      });
    } catch {
      relativeTime = summary.lastSuccessfulDeploy;
    }
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono select-none">
      {/* Card 1: Active Environments */}
      <div className="p-3.5 sm:p-4 rounded-lg bg-[#0c0c0e]/90 border border-zinc-800/80 space-y-1.5 shadow-lg">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="text-[10px] uppercase font-bold tracking-wider">Active Envs</span>
          <HugeiconsIcon icon={FolderCodeIcon} size={15} />
        </div>
        <div className="text-xl font-bold text-white font-sans">
          {summary.activeEnvironments} <span className="text-xs font-mono font-normal text-zinc-500">Envs</span>
        </div>
        <p className="text-[10px] text-zinc-500 truncate">
          {summary.healthyCount} healthy, {summary.warningCount} degraded
        </p>
      </div>

      {/* Card 2: Production Status */}
      <div className="p-3.5 sm:p-4 rounded-lg bg-[#0c0c0e]/90 border border-zinc-800/80 space-y-1.5 shadow-lg">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="text-[10px] uppercase font-bold tracking-wider">Production</span>
          <HugeiconsIcon icon={RocketIcon} size={15} />
        </div>
        <div className="text-xl font-bold font-sans capitalize text-white">
          {summary.productionStatus}
        </div>
        <p className="text-[10px] text-zinc-500 truncate">Live production environment</p>
      </div>

      {/* Card 3: Total Deployments */}
      <div className="p-3.5 sm:p-4 rounded-lg bg-[#0c0c0e]/90 border border-zinc-800/80 space-y-1.5 shadow-lg">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="text-[10px] uppercase font-bold tracking-wider">Total Deployments</span>
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
        </div>
        <div className="text-xl font-bold text-white font-sans">
          {summary.totalDeployments}
        </div>
        <p className="text-[10px] text-zinc-500 truncate">Across all project branches</p>
      </div>

      {/* Card 4: Last Deployment */}
      <div className="p-3.5 sm:p-4 rounded-lg bg-[#0c0c0e]/90 border border-zinc-800/80 space-y-1.5 shadow-lg">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="text-[10px] uppercase font-bold tracking-wider">Last Deploy</span>
          <HugeiconsIcon icon={Clock01Icon} size={15} />
        </div>
        <div className="text-sm font-bold text-white truncate font-sans pt-1">
          {relativeTime}
        </div>
        <p className="text-[10px] text-zinc-500 truncate">Most recent release timestamp</p>
      </div>
    </div>
  );
};
