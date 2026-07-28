import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FolderCheckIcon, Clock01Icon, Task01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import type { ClientStats } from '../../../types/client';

interface ClientStatisticsProps {
  stats?: ClientStats;
  isLoading?: boolean;
}

export const ClientStatistics: React.FC<ClientStatisticsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse select-none">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/40" />
        ))}
      </div>
    );
  }

  const items = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects ?? 0,
      icon: FolderCheckIcon,
      label: 'All time contracts',
    },
    {
      title: 'Active Projects',
      value: stats?.activeProjects ?? 0,
      icon: Clock01Icon,
      label: 'Currently in progress',
    },
    {
      title: 'Completed Projects',
      value: stats?.completedProjects ?? 0,
      icon: CheckmarkCircle01Icon,
      label: 'Delivered engagements',
    },
    {
      title: 'On Hold Projects',
      value: stats?.onHoldProjects ?? 0,
      icon: Task01Icon,
      label: 'Paused contracts',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full select-none">
      {items.map((card) => (
        <div
          key={card.title}
          className="p-4 rounded-lg bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 backdrop-blur-2xl shadow-xl space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">{card.title}</span>
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <HugeiconsIcon icon={card.icon} size={15} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
          <p className="text-[10px] text-zinc-500 font-mono truncate">{card.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ClientStatistics;
