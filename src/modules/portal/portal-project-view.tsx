import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePortalContext } from './context/PortalContext';
import { TimelineTab } from '../timeline/timeline-tab';
import { MilestonesTab } from '../milestones/milestones-tab';
import { ScreenshotsTab } from '../screenshots/screenshots-tab';
import { DocumentationTab } from '../documentation/documentation-tab';
import { FileManagerTab } from '../files/file-manager-tab';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  DashboardSquare01Icon,
  Clock01Icon,
  Flag01Icon,
  Image01Icon,
  FileCodeIcon,
  FolderCodeIcon,
  LockKeyIcon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { format } from 'date-fns';

export interface PortalProjectViewProps {
  className?: string;
}

export const PortalProjectView: React.FC<PortalProjectViewProps> = ({ className = '' }) => {
  const { project, projectId } = usePortalContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'milestones' | 'screenshots' | 'docs' | 'files'>('overview');

  const currentProjectId = projectId || project?.id || undefined;

  return (
    <div className={`w-full max-w-[1600px] mx-auto space-y-6 font-sans select-none ${className}`}>
      {/* Project Banner & Read-Only Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0c0c0e]/95 border border-zinc-800/90 shadow-2xl space-y-6 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 uppercase tracking-wider font-semibold">
                {project?.status || 'Active Contract'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                <HugeiconsIcon icon={LockKeyIcon} size={12} className="text-zinc-600" />
                <span>Client Viewer Access</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              {project?.name || 'Project Progress Portal'}
            </h1>

            {project?.description && (
              <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-3xl leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 shrink-0">
            <div className="space-y-0.5 text-right">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Completion Rate</span>
              <span className="text-2xl font-bold font-mono text-white">{project?.progress || 0}%</span>
            </div>
            <div className="w-14 h-14 rounded-full bg-zinc-950 border border-zinc-700/80 flex items-center justify-center">
              <span className="text-xs font-mono font-bold text-emerald-400">{project?.progress || 0}%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Key Details */}
        <div className="space-y-3">
          <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project?.progress || 0}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
            <span>Deadline: {project?.dueDate ? format(new Date(project.dueDate), 'MMM d, yyyy') : 'TBD'}</span>
            <span>Priority: <span className="uppercase text-white">{project?.priority || 'Medium'}</span></span>
          </div>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 overflow-x-auto custom-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: DashboardSquare01Icon },
          { id: 'timeline', label: 'Timeline Updates', icon: Clock01Icon },
          { id: 'milestones', label: 'Milestones', icon: Flag01Icon },
          { id: 'screenshots', label: 'Gallery', icon: Image01Icon },
          { id: 'docs', label: 'Documentation', icon: FileCodeIcon },
          { id: 'files', label: 'Vault Files', icon: FolderCodeIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-white text-black font-semibold shadow-lg'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
            }`}
          >
            <HugeiconsIcon icon={tab.icon} size={15} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels with Existing Reused Components in readOnly Mode */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="pt-2"
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0c0c0e]/80 border border-zinc-800/80 space-y-4">
              <h3 className="text-xs font-mono font-semibold uppercase text-zinc-400 tracking-wider flex items-center gap-2">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-emerald-400" />
                <span>Project Status Summary</span>
              </h3>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Welcome to your read-only project progress portal. Select any of the tabs above to inspect timeline updates, upcoming milestones, screenshot demos, technical documentation, or download vault assets.
              </p>
            </div>
            <MilestonesTab projectId={currentProjectId} readOnly={true} />
          </div>
        )}

        {activeTab === 'timeline' && (
          <TimelineTab projectId={currentProjectId} isReadOnly={true} />
        )}

        {activeTab === 'milestones' && (
          <MilestonesTab projectId={currentProjectId} readOnly={true} />
        )}

        {activeTab === 'screenshots' && (
          <ScreenshotsTab projectId={currentProjectId} readOnly={true} />
        )}

        {activeTab === 'docs' && (
          <DocumentationTab projectId={currentProjectId} readOnly={true} />
        )}

        {activeTab === 'files' && (
          <FileManagerTab projectId={currentProjectId} readOnly={true} />
        )}
      </motion.div>
    </div>
  );
};

export default PortalProjectView;
