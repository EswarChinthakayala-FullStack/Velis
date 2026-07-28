import React from 'react';
import { motion } from 'framer-motion';
import { useProject, useUpdateProject, useConnectProjectGithubRepo } from '../../lib/supabase/queries/projects';
import { useProjectTechnologies } from '../../lib/supabase/queries/technologies';
import { ProjectDescriptionCard } from './components/ProjectDescriptionCard';
import { ProjectClientCard } from './components/ProjectClientCard';
import { ProjectTimelineCard } from './components/ProjectTimelineCard';
import { ProjectCompletionCard } from './components/ProjectCompletionCard';
import { ProjectMetadataCard } from './components/ProjectMetadataCard';
import { TechnologyPicker } from './technology-picker';
import { HugeiconsIcon } from '@hugeicons/react';
import { CpuIcon, SparklesIcon, Layers01Icon } from '@hugeicons/core-free-icons';
import type { ProjectStatus, ProjectPriority } from '../../types/project';

interface ProjectOverviewTabProps {
  projectId: string;
}

/**
 * Enterprise Project Overview Workspace Tab (PHASE 07)
 * Primary Metadata Workspace displaying description, client, tech stack,
 * completion progress, timeline, and metadata with live inline editing and Supabase sync.
 */
export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({ projectId }) => {
  const { data: project, isLoading: isProjectLoading, refetch } = useProject(projectId);
  const { data: technologies = [], isLoading: isTechLoading } = useProjectTechnologies(projectId);
  const updateProjectMutation = useUpdateProject();
  const connectGithubRepoMutation = useConnectProjectGithubRepo();

  const handleSaveDescription = async (newDescription: string) => {
    if (!projectId) return;
    await updateProjectMutation.mutateAsync({
      id: projectId,
      values: { description: newDescription },
    });
  };

  const handleUpdateMetadata = async (input: { status?: ProjectStatus; priority?: ProjectPriority }) => {
    if (!projectId) return;
    await updateProjectMutation.mutateAsync({
      id: projectId,
      values: input,
    });
  };

  const handleConnectRepo = async (repoUrl: string) => {
    if (!projectId) return;
    await connectGithubRepoMutation.mutateAsync({
      projectId,
      repoUrl,
    });
  };

  if (isProjectLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-pulse">
        <div className="lg:col-span-2 space-y-5">
          <div className="h-64 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
          <div className="h-44 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
          <div className="h-32 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
        </div>
        <div className="space-y-5">
          <div className="h-40 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
          <div className="h-44 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
          <div className="h-56 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-zinc-100"
    >
      {/* Left Column (2 Cols on Desktop) */}
      <div className="lg:col-span-2 space-y-5 min-w-0">
        {/* Section 1: Project Description */}
        <ProjectDescriptionCard
          description={project.description}
          onSaveDescription={handleSaveDescription}
        />

        {/* Section 2: Client Profile Card */}
        <ProjectClientCard
          clientId={project.clientId}
          clientName={project.clientName}
          clientCompany={project.clientCompany}
        />

        {/* Section 3: Technologies Stack */}
        <div className="relative z-30 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
              <HugeiconsIcon icon={CpuIcon} size={15} className="text-zinc-400" />
              <span>Technology Stack & Frameworks</span>
            </div>

            <span className="text-[11px] font-mono text-zinc-500">
              {technologies.length} {technologies.length === 1 ? 'Tech' : 'Techs'} Added
            </span>
          </div>

          <TechnologyPicker projectId={projectId} value={technologies} />
        </div>
      </div>

      {/* Right Column (1 Col on Desktop) */}
      <div className="space-y-5 min-w-0">
        {/* Section 4: Completion Progress Ring */}
        <ProjectCompletionCard completionPercent={project.completionPercent} />

        {/* Section 5: Project Timeline */}
        <ProjectTimelineCard
          startDate={project.startDate}
          deadline={project.deadline}
        />

        {/* Section 6: Project Metadata */}
        <ProjectMetadataCard
          projectId={project.id}
          status={project.status}
          priority={project.priority}
          createdAt={project.createdAt}
          updatedAt={project.updatedAt}
          githubRepoUrl={project.githubRepo?.repoUrl}
          onUpdateMetadata={handleUpdateMetadata}
          onConnectRepo={handleConnectRepo}
        />
      </div>
    </motion.div>
  );
};

export default ProjectOverviewTab;
