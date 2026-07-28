import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Add01Icon,
  GridIcon,
  MenuSquareIcon,
  GitBranchIcon
} from '@hugeicons/core-free-icons';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassInput } from '../ui/GlassInput';
import { GlassBadge } from '../ui/GlassBadge';
import { DataTable, type Column } from '../ui/DataTable';
import type { Project } from '../../types';

interface ProjectsViewProps {
  projects: Project[];
  onOpenCreateProject: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenCreateProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewType, setViewType] = useState<'grid' | 'table'>('grid');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Project>[] = [
    {
      header: 'Project Name',
      cell: (p) => (
        <div>
          <div className="font-semibold text-white">{p.name}</div>
          <div className="text-xs text-zinc-400">{p.clientName}</div>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (p) => (
        <GlassBadge variant="zinc" size="sm">
          {p.status.replace('_', ' ')}
        </GlassBadge>
      )
    },
    {
      header: 'Progress',
      cell: (p) => (
        <div className="w-32">
          <div className="flex justify-between text-xs mb-1 font-mono text-zinc-300">
            <span>{p.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-200 rounded-full"
              style={{ width: `${p.progress}%` }}
            />
          </div>
        </div>
      )
    },
    {
      header: 'Budget & Spent',
      cell: (p) => (
        <div className="text-xs font-mono">
          <span className="text-white">${p.spent.toLocaleString()}</span>
          <span className="text-zinc-500"> / ${p.budget.toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Due Date',
      cell: (p) => (
        <div className="text-xs text-zinc-400 font-mono">{p.dueDate}</div>
      )
    },
    {
      header: 'GitHub Repo',
      cell: (p) => (
        <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
          <HugeiconsIcon icon={GitBranchIcon} size={14} className="text-zinc-400" />
          <span className="truncate max-w-[140px]">{p.githubRepo.split('/')[1]}</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Client Projects
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Manage active developer contracts, client deliverables, and repository linkages.
          </p>
        </div>
        <GlassButton variant="primary" onClick={onOpenCreateProject}>
          <HugeiconsIcon icon={Add01Icon} size={16} className="mr-2" /> Create Project
        </GlassButton>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-[20px] bg-zinc-900/40 border border-zinc-800/80">
        <div className="flex items-center gap-3 flex-1">
          <GlassInput
            icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
            placeholder="Search projects by name, client, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-zinc-950/60 rounded-xl border border-zinc-800/60">
            {['all', 'in_progress', 'review', 'completed', 'planning'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                  selectedStatus === status
                    ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/60">
          <button
            onClick={() => setViewType('grid')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewType === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
            title="Grid View"
          >
            <HugeiconsIcon icon={GridIcon} size={16} />
          </button>
          <button
            onClick={() => setViewType('table')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewType === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
            title="Table View"
          >
            <HugeiconsIcon icon={MenuSquareIcon} size={16} />
          </button>
        </div>
      </div>

      {/* Projects Render Container */}
      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => (
            <GlassCard key={p.id} hoverEffect className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <GlassBadge variant="zinc" size="sm">
                    {p.status.replace('_', ' ')}
                  </GlassBadge>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Due {p.dueDate}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {p.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{p.clientName}</p>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                  {p.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-zinc-800/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Progress</span>
                  <span className="font-mono font-semibold text-white">{p.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-200 rounded-full"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={GitBranchIcon} size={14} />
                    <span className="truncate max-w-[120px]">{p.githubRepo.split('/')[1]}</span>
                  </div>
                  <span>${p.budget.toLocaleString()}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <DataTable
          data={filteredProjects}
          columns={columns}
          keyExtractor={(p) => p.id}
          emptyText="No projects match your filter criteria."
        />
      )}
    </div>
  );
};
