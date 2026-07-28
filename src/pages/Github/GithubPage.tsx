import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useProjects } from '../../lib/supabase/queries/projects';
import { GitHubPanel } from '../../modules/github/github-panel';
import { GitHubLinkForm } from '../../modules/github/github-link-form';
import { HugeiconsIcon } from '@hugeicons/react';
import { GitBranchIcon } from '@hugeicons/core-free-icons';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import type { ProjectItem } from '../../types/project';

export const GithubPage: React.FC = () => {
  const { data: projectsData, isLoading } = useProjects();
  const projects: ProjectItem[] = projectsData?.projects || [];
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Auto-select first project with a connected GitHub repo or first project
  const activeProject = projects.find((p) => p.id === selectedProjectId) ||
    projects.find((p) => Boolean(p.githubRepo?.repoUrl)) ||
    projects[0];

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 text-zinc-100 select-none pb-12">
      {/* Header & Project Selector */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-800/80 select-none min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
            <HugeiconsIcon icon={GitBranchIcon} size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none truncate">
              GitHub Repositories
            </h1>
            <p className="text-xs text-zinc-400 font-mono truncate hidden sm:block mt-1">
              Enterprise repository health, commit history, releases, and development activity.
            </p>
          </div>
        </div>

        {/* Project Selector Custom UI Dropdown */}
        {projects.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-zinc-500 hidden md:inline">Project:</span>
            <Select
              value={activeProject?.id || ''}
              onValueChange={(val) => {
                if (typeof val === 'string') {
                  setSelectedProjectId(val);
                }
              }}
            >
              <SelectTrigger className="w-auto min-w-[150px] max-w-[210px] font-mono bg-zinc-900 border-zinc-700/80 text-white hover:border-zinc-600 shrink-0">
                <SelectValue>
                  {activeProject ? `${activeProject.name}${activeProject.githubRepo ? ' (Connected)' : ''}` : 'Select project...'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="end" className="bg-[#111113] border-zinc-800">
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="font-mono">
                    {p.name} {p.githubRepo ? ' (Connected)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Main GitHub Panel */}
      {isLoading ? (
        <div className="h-64 rounded-xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse" />
      ) : activeProject ? (
        <GitHubPanel
          key={activeProject.id}
          projectId={activeProject.id}
          githubRepoUrl={activeProject.githubRepo?.repoUrl}
          lastSyncedAt={activeProject.githubRepo?.lastSyncedAt}
          onConnectRepo={() => setIsConnectModalOpen(true)}
        />
      ) : (
        <div className="p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800 rounded-xl bg-zinc-950">
          No projects available in workspace.
        </div>
      )}

      {/* Modal Dialog Portal for Connecting Repository */}
      {isConnectModalOpen && activeProject &&
        createPortal(
          <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none">
            <div className="w-full max-w-2xl my-auto">
              <GitHubLinkForm
                projectId={activeProject.id}
                onSuccess={() => setIsConnectModalOpen(false)}
                onCancel={() => setIsConnectModalOpen(false)}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default GithubPage;
