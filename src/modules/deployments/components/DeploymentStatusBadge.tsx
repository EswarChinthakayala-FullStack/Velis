import React from 'react';
import type { HealthStatus, DeploymentStatus } from '../types/deployment';

interface HealthBadgeProps {
  status: HealthStatus;
}

export const HealthStatusBadge: React.FC<HealthBadgeProps> = ({ status }) => {
  switch (status) {
    case 'healthy':
      return (
        <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Healthy</span>
        </span>
      );
    case 'warning':
      return (
        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-400 inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Degraded</span>
        </span>
      );
    case 'offline':
      return (
        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-mono text-rose-400 inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>Offline</span>
        </span>
      );
    case 'unknown':
    default:
      return (
        <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500 inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
          <span>Unknown</span>
        </span>
      );
  }
};

interface EnvStatusBadgeProps {
  status: DeploymentStatus;
}

export const EnvStatusBadge: React.FC<EnvStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'active':
      return (
        <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-200 uppercase font-bold">
          Active
        </span>
      );
    case 'maintenance':
      return (
        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-400 uppercase font-bold">
          Maintenance
        </span>
      );
    case 'offline':
      return (
        <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-[10px] font-mono text-rose-400 uppercase font-bold">
          Offline
        </span>
      );
    case 'deprecated':
      return (
        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500 uppercase font-bold">
          Deprecated
        </span>
      );
    case 'archived':
    default:
      return (
        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-600 uppercase font-bold">
          Archived
        </span>
      );
  }
};
