import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../projects/hooks/useProjects';
import { useShareLinks } from './hooks/useShareLinks';
import { useGenerateShareLink } from './hooks/useGenerateShareLink';
import { useDisableShareLink } from './hooks/useDisableShareLink';
import { useRegenerateShareLink } from './hooks/useRegenerateShareLink';
import { useDeleteShareLink } from './hooks/useDeleteShareLink';
import type { ShareLinkItem, GenerateShareLinkInput } from './lib/types/share-link';
import { calculateShareLinkStats } from './lib/utils/share-link';

// Components
import { ShareLinksHeader } from './components/ShareLinksHeader';
import { ShareLinksStats } from './components/ShareLinksStats';
import { ShareLinksTable } from './components/ShareLinksTable';
import { EmptyShareLinks } from './components/EmptyShareLinks';
import { SkeletonShareLinks } from './components/SkeletonShareLinks';
import { GenerateShareDialog } from './components/GenerateShareDialog';
import { DisableShareDialog } from './components/DisableShareDialog';
import { RegenerateShareDialog } from './components/RegenerateShareDialog';
import { DeleteShareDialog } from './components/DeleteShareDialog';
import { ShareAnalyticsDrawer } from './components/ShareAnalyticsDrawer';

export interface ShareLinksPanelProps {
  projectId?: string;
}

export const ShareLinksPanel: React.FC<ShareLinksPanelProps> = ({ projectId: propProjectId }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(propProjectId || 'all');

  // Modals & Drawers state
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [analyticsLink, setAnalyticsLink] = useState<ShareLinkItem | null>(null);
  const [disableTargetLink, setDisableTargetLink] = useState<ShareLinkItem | null>(null);
  const [regenerateTargetLink, setRegenerateTargetLink] = useState<ShareLinkItem | null>(null);
  const [deleteTargetLink, setDeleteTargetLink] = useState<ShareLinkItem | null>(null);

  // Live Supabase queries via React Query
  const { data: projectsData } = useProjects();
  const { data: shareLinks = [], isLoading, isError } = useShareLinks(selectedProjectId);

  // React Query Mutations
  const generateMutation = useGenerateShareLink(selectedProjectId);
  const disableMutation = useDisableShareLink();
  const regenerateMutation = useRegenerateShareLink();
  const deleteMutation = useDeleteShareLink();

  // Normalize project list
  const projectList = useMemo(() => {
    const raw =
      (projectsData as any)?.projects ||
      (projectsData as any)?.data ||
      (Array.isArray(projectsData) ? projectsData : []);

    return raw.map((p: any) => ({
      id: p.id,
      name: p.name || p.title || 'Untitled Project',
    }));
  }, [projectsData]);

  // Live calculated stats
  const stats = useMemo(() => calculateShareLinkStats(shareLinks), [shareLinks]);

  // Handlers
  const handleGenerate = (values: GenerateShareLinkInput) => {
    generateMutation.mutate({
      projectId: values.projectId,
      expirationPreset: values.expirationPreset,
      customExpirationDate: values.customExpirationDate,
      hasPassword: values.hasPassword,
      password: values.password,
      notes: values.notes,
    });
  };

  const handleDisableConfirm = (linkId: string) => {
    disableMutation.mutate(linkId);
  };

  const handleRegenerateConfirm = (linkId: string) => {
    regenerateMutation.mutate(linkId);
  };

  const handleDeleteConfirm = (linkId: string) => {
    deleteMutation.mutate(linkId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 font-sans select-none"
    >
      {/* Workspace Header */}
      <ShareLinksHeader onOpenGenerateDialog={() => setIsGenerateDialogOpen(true)} />

      {/* Main Workspace Body */}
      {isLoading ? (
        <SkeletonShareLinks />
      ) : isError ? (
        <div className="p-6 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-xs font-mono">
          Failed to load project share links. Please refresh or check database connection.
        </div>
      ) : shareLinks.length === 0 ? (
        <EmptyShareLinks onGenerate={() => setIsGenerateDialogOpen(true)} />
      ) : (
        <>
          {/* Stats Header Grid */}
          <ShareLinksStats stats={stats} />

          {/* Table Container */}
          <ShareLinksTable
            links={shareLinks}
            onOpenGenerateDialog={() => setIsGenerateDialogOpen(true)}
            onOpenAnalytics={(link) => setAnalyticsLink(link)}
            onDisable={(link) => setDisableTargetLink(link)}
            onRegenerate={(link) => setRegenerateTargetLink(link)}
            onDelete={(link) => setDeleteTargetLink(link)}
          />
        </>
      )}

      {/* Generate Link Dialog */}
      <GenerateShareDialog
        isOpen={isGenerateDialogOpen}
        onClose={() => setIsGenerateDialogOpen(false)}
        onGenerate={handleGenerate}
        projects={projectList}
        defaultProjectId={selectedProjectId}
        isLoading={generateMutation.isPending}
      />

      {/* Disable Link Dialog */}
      <DisableShareDialog
        isOpen={Boolean(disableTargetLink)}
        link={disableTargetLink}
        onClose={() => setDisableTargetLink(null)}
        onConfirm={handleDisableConfirm}
        isLoading={disableMutation.isPending}
      />

      {/* Regenerate Token AlertDialog */}
      <RegenerateShareDialog
        isOpen={Boolean(regenerateTargetLink)}
        link={regenerateTargetLink}
        onClose={() => setRegenerateTargetLink(null)}
        onConfirm={handleRegenerateConfirm}
        isLoading={regenerateMutation.isPending}
      />

      {/* Delete Link Dialog */}
      <DeleteShareDialog
        isOpen={Boolean(deleteTargetLink)}
        link={deleteTargetLink}
        onClose={() => setDeleteTargetLink(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />

      {/* Analytics Drawer */}
      <ShareAnalyticsDrawer
        isOpen={Boolean(analyticsLink)}
        link={analyticsLink}
        onClose={() => setAnalyticsLink(null)}
      />
    </motion.div>
  );
};

export default ShareLinksPanel;
