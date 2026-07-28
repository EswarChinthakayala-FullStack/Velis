import React, { useState } from 'react';
import { useProjects } from '../../lib/supabase/queries/projects';
import { TimelineTab } from '../../modules/timeline/timeline-tab';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import type { ProjectItem } from '../../types/project';

export const TimelinePage: React.FC = () => {
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects();
  const projects: ProjectItem[] = projectsData?.projects || [];
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const projectSelectorNode = projects.length > 0 ? (
    <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
      <span className="text-zinc-500 hidden md:inline">Project:</span>
      <Select
        value={activeProject?.id || ''}
        onValueChange={(val) => {
          if (typeof val === 'string') {
            setSelectedProjectId(val);
          }
        }}
      >
        <SelectTrigger className="w-auto min-w-[140px] max-w-[210px] font-mono bg-zinc-900 border-zinc-700/80 text-white hover:border-zinc-600 shrink-0">
          <SelectValue>
            {activeProject ? activeProject.name : 'Select project...'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end" className="bg-[#111113] border-zinc-800">
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id} className="font-mono">
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ) : null;

  return (
    <div className="w-full max-w-[1600px] mx-auto text-zinc-100 select-none pb-12">
      {isProjectsLoading ? (
        <div className="h-64 rounded-xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse" />
      ) : (
        <TimelineTab
          key={activeProject?.id || 'timeline'}
          projectId={activeProject?.id}
          projectSelector={projectSelectorNode}
        />
      )}
    </div>
  );
};

export default TimelinePage;
