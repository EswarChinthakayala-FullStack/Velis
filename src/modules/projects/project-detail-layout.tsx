import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../lib/supabase/queries/projects';
import { useProjectSections, useCreateProjectSection } from '../../lib/supabase/queries/project-sections';
import { ProjectBreadcrumb } from './components/ProjectBreadcrumb';
import { ProjectWorkspaceHeader } from './components/ProjectWorkspaceHeader';
import { ProjectTabs } from './components/ProjectTabs';
import { MarkdownWorkspace } from './components/MarkdownWorkspace';
import { ProjectOverviewTab } from './project-overview-tab';
import { GitHubPanel } from '../github/github-panel';
import { TimelineTab } from '../timeline/timeline-tab';
import { MilestonesTab } from '../milestones/milestones-tab';
import { ChangelogTab } from '../changelog/changelog-tab';
import { DeploymentsTab } from '../deployments/deployments-tab';
import { ProjectWorkspaceSkeleton } from './components/ProjectWorkspaceSkeleton';
import { ProjectFormDrawer } from './project-form-drawer';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';

/**
 * ProjectDetailLayout Component (PHASE 07 & PHASE 11)
 * Enterprise Project Workspace Operating System for Velis.
 * 
 * Central hub for project management, metadata overview, roadmap milestones, and modular documentation.
 * Backed 100% by live Supabase queries via React Query v5.
 * Strictly production-only: ZERO mock data or hardcoded placeholder sections.
 */
export const ProjectDetailLayout: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  // Fetch Project Metadata & Sections
  const { data: project, isLoading: isProjectLoading, isError: isProjectError, refetch: refetchProject } = useProject(projectId);
  const { data: sections = [], isLoading: isSectionsLoading, refetch: refetchSections } = useProjectSections(projectId);
  const createSectionMutation = useCreateProjectSection();

  // Set default active section when sections load
  React.useEffect(() => {
    if (sections.length > 0 && !activeSectionId) {
      setActiveSectionId(sections[0].id);
    }
  }, [sections, activeSectionId]);

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  const handleAddSection = async (name: string) => {
    if (!projectId) return;
    try {
      const newSection = await createSectionMutation.mutateAsync({ projectId, name });
      setActiveSectionId(newSection.id);
    } catch (err) {
      // Error handled silently
    }
  };

  const isLoading = isProjectLoading || isSectionsLoading;
  const activeSectionName = activeSection?.name?.toLowerCase() || '';
  const isOverviewActive = activeSectionName === 'overview';
  const isGithubActive = activeSectionName === 'github' || activeSectionName === 'repository';
  const isTimelineActive = activeSectionName === 'timeline' || activeSectionName === 'history' || activeSectionName === 'updates';
  const isMilestonesActive = activeSectionName === 'milestones' || activeSectionName === 'roadmap' || activeSectionName === 'deliverables';
  const isChangelogActive = activeSectionName === 'changelog' || activeSectionName === 'releases' || activeSectionName === 'versions';
  const isDeploymentsActive = activeSectionName === 'deployments' || activeSectionName === 'environments' || activeSectionName === 'hosting';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="w-full max-w-[1600px] mx-auto space-y-5 text-zinc-100 select-none pb-12"
    >
      {/* 1. Loading Skeleton */}
      {isLoading && <ProjectWorkspaceSkeleton />}

      {/* 2. Error State */}
      {isProjectError && (
        <div className="p-12 text-center border border-zinc-800/80 rounded-xl bg-[rgba(17,17,19,0.85)] space-y-4 max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-800 flex items-center justify-center text-rose-400 mx-auto">
            <HugeiconsIcon icon={AlertCircleIcon} size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Project workspace unavailable</h3>
            <p className="text-xs text-zinc-400 font-mono">
              Unable to load project details or sections from Supabase.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => navigate('/app/projects')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              <span>Back to Directory</span>
            </button>
            <button
              onClick={() => {
                refetchProject();
                refetchSections();
              }}
              className="px-4 py-1.5 bg-white text-black font-semibold rounded-lg text-xs cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Workspace content */}
      {!isLoading && !isProjectError && project && (
        <div className="space-y-5">
          {/* Breadcrumb Navigation */}
          <ProjectBreadcrumb
            projectName={project.name}
            activeSectionName={activeSection?.name || 'Overview'}
          />

          {/* Project Workspace Header */}
          <ProjectWorkspaceHeader
            project={project}
            onEditProject={() => setIsEditDrawerOpen(true)}
          />

          {/* Dynamic Section Tabs */}
          {sections.length > 0 && (
            <ProjectTabs
              sections={sections}
              activeSectionId={activeSection?.id || ''}
              onSelectSection={(id) => setActiveSectionId(id)}
              onAddSection={handleAddSection}
            />
          )}

          {/* Active Workspace View: Project Overview Profile vs GitHub Workspace vs Timeline Workspace vs Milestones Roadmap vs Markdown Workspace */}
          {isOverviewActive || !activeSection ? (
            <ProjectOverviewTab projectId={project.id} />
          ) : isGithubActive ? (
            <GitHubPanel
              projectId={project.id}
              githubRepoUrl={project.githubRepo?.repoUrl}
              lastSyncedAt={project.githubRepo?.lastSyncedAt}
              onConnectRepo={() => setIsEditDrawerOpen(true)}
            />
          ) : isTimelineActive ? (
            <TimelineTab projectId={project.id} />
          ) : isMilestonesActive ? (
            <MilestonesTab projectId={project.id} />
          ) : isChangelogActive ? (
            <ChangelogTab projectId={project.id} />
          ) : isDeploymentsActive ? (
            <DeploymentsTab projectId={project.id} />
          ) : (
            <MarkdownWorkspace
              key={activeSection.id}
              section={activeSection}
              projectId={project.id}
            />
          )}

          {/* Edit Project Form Drawer */}
          <ProjectFormDrawer
            open={isEditDrawerOpen}
            onOpenChange={setIsEditDrawerOpen}
            mode="edit"
            project={project}
          />
        </div>
      )}
    </motion.div>
  );
};

export default ProjectDetailLayout;

