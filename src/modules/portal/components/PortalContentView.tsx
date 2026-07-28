import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePortalContext } from '../context/PortalContext';
import { PortalHeader } from './PortalHeader';
import { PortalFooter } from './PortalFooter';
import { PortalSidebar, type PortalTabType } from './PortalSidebar';
import { TimelineTab } from '../../timeline/timeline-tab';
import { MilestonesTab } from '../../milestones/milestones-tab';
import { ScreenshotsTab } from '../../screenshots/screenshots-tab';
import { DocumentationTab } from '../../documentation/documentation-tab';
import { FileManagerTab } from '../../files/file-manager-tab';
import { PortalPaymentView } from './PortalPaymentView';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon,
  Flag01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { format } from 'date-fns';

import { ChangelogTab } from '../../changelog/changelog-tab';
import { DeploymentsTab } from '../../deployments/deployments-tab';

const TAB_TITLES: Record<PortalTabType, string> = {
  overview: 'Dashboard',
  timeline: 'Timeline',
  milestones: 'Milestones',
  screenshots: 'Gallery',
  docs: 'Documentation',
  files: 'File Vault',
  payments: 'Finances & Delivery',
  changelog: 'Release History',
  deployments: 'Environments',
};

export const PortalContentView: React.FC = () => {
  const { project, projectId } = usePortalContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Extract subpath: e.g. /share/abcd1234/payments -> 'payments'
  const rawTab = location.pathname.split(`/share/${token}/`)[1]?.split('/')[0] as PortalTabType | undefined;
  const activeTab: PortalTabType = (rawTab && TAB_TITLES[rawTab]) ? rawTab : 'overview';

  const handleSelectTab = (tab: PortalTabType) => {
    if (token) {
      const targetUrl = tab === 'overview' ? `/share/${token}` : `/share/${token}/${tab}`;
      if (location.pathname !== targetUrl) {
        navigate(targetUrl);
      }
    }
  };

  const currentProjectId = projectId || project?.id || undefined;
  const progress = project?.progress || 0;

  return (
    /* Viewport Container: Fixed h-screen & w-screen, strictly overflow-hidden */
    <div className="h-screen w-screen bg-[#080809] text-zinc-100 flex font-sans select-none overflow-hidden">
      {/* 1. Left Sidebar (Fixed 100vh height) */}
      <PortalSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        projectName={project?.name}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Right Main Column (Fixed 100vh height flex flex-col) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Fixed Top Header (Does NOT scroll) */}
        <PortalHeader
          projectName={project?.name}
          status={project?.status || undefined}
          activeTabTitle={TAB_TITLES[activeTab]}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* 3. Independent Scrollable View Area (ONLY this section scrolls) */}
        <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="w-full space-y-6">
              {/* ── Project Overview Banner ── */}
              <div className="rounded-lg bg-[#0c0c0d] border border-zinc-800/50 overflow-hidden">
                {/* Top section */}
                <div className="px-6 py-5 sm:px-8 sm:py-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                    {/* Project info */}
                    <div className="space-y-3 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          {project?.status || 'Active'}
                        </span>
                      </div>

                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                        {project?.name || 'Project Portal'}
                      </h1>

                      {project?.description && (
                        <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>

                    {/* Progress ring */}
                    <div className="flex items-center gap-5 lg:gap-6 shrink-0">
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        {project?.dueDate && (
                          <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={Calendar01Icon} size={13} className="text-zinc-600" />
                            <span>{format(new Date(project.dueDate), 'MMM d, yyyy')}</span>
                          </div>
                        )}
                        {project?.priority && (
                          <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={Flag01Icon} size={13} className="text-zinc-600" />
                            <span className="capitalize">{project.priority}</span>
                          </div>
                        )}
                      </div>

                      {/* Circular progress */}
                      <div className="relative w-14 h-14 shrink-0">
                        <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                          <motion.circle
                            cx="24" cy="24" r="20" fill="none"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - progress / 100) }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-zinc-200">{progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar bottom strip */}
                <div className="h-1 bg-white/[0.03]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-zinc-500/60 to-zinc-400/40"
                  />
                </div>
              </div>

              {/* ── Page Content ── */}
              <div className="w-full">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="w-full"
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Welcome card */}
                      <div className="rounded-lg bg-[#0c0c0d] border border-zinc-800/50 p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0 mt-0.5">
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-zinc-400" />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <h3 className="text-sm font-semibold text-zinc-200">Welcome to your project portal</h3>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                              This is a read-only view of your project's progress. Navigate using the sidebar to review timeline updates, milestones, screenshots, documentation, and project assets.
                            </p>
                          </div>
                        </div>
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

                  {activeTab === 'changelog' && (
                    <ChangelogTab projectId={currentProjectId} readOnly={true} />
                  )}

                  {activeTab === 'deployments' && (
                    <DeploymentsTab projectId={currentProjectId} readOnly={true} />
                  )}

                  {activeTab === 'payments' && (
                    <PortalPaymentView projectId={currentProjectId} />
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Footer at bottom of scrollable area */}
          <PortalFooter />
        </main>
      </div>
    </div>
  );
};

export default PortalContentView;
