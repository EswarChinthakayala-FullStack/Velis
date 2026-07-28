import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProjectScreenshots, useUploadScreenshotMutation, useDeleteScreenshotMutation } from '../../lib/supabase/queries/screenshots';
import { useProjects } from '../projects/hooks/useProjects';
import type { ScreenshotItem } from './lib/types/screenshot';

import { GalleryToolbar, type ProjectOption } from './components/GalleryToolbar';
import { MilestoneGroup } from './components/MilestoneGroup';
import { ScreenshotLightbox } from './components/ScreenshotLightbox';
import { ScreenshotMetadataDrawer } from './components/ScreenshotMetadataDrawer';
import { GalleryEmptyState } from './components/GalleryEmptyState';
import { GallerySkeleton } from './components/GallerySkeleton';

import { useScreenshotFilters } from './hooks/useScreenshotFilters';
import { useScreenshotGrouping } from './hooks/useScreenshotGrouping';
import { getSignedScreenshotUrl } from './lib/utils/signed-url';

import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Cancel01Icon, Image01Icon } from '@hugeicons/core-free-icons';

import { ConfirmDeleteDialog } from '../../components/ui/confirm-delete-dialog';

interface ScreenshotsTabProps {
  projectId?: string;
  readOnly?: boolean;
  className?: string;
}

export const ScreenshotsTab: React.FC<ScreenshotsTabProps> = ({
  projectId,
  readOnly = false,
  className = '',
}) => {
  // Project selection state
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || 'all');
  const { data: projectsResult } = useProjects();

  const activeProjectId = projectId || (selectedProjectId === 'all' ? undefined : selectedProjectId);

  // Query & Mutations
  const { data: screenshots = [], isLoading } = useProjectScreenshots(activeProjectId);
  const uploadMutation = useUploadScreenshotMutation(activeProjectId);
  const deleteMutation = useDeleteScreenshotMutation(activeProjectId);

  // Filters & Grouping hooks
  const {
    searchQuery,
    setSearchQuery,
    selectedModule,
    setSelectedModule,
    layoutMode,
    setLayoutMode,
    sortOrder,
    setSortOrder,
    availableModules,
    filteredScreenshots,
  } = useScreenshotFilters(screenshots);

  const { milestoneGroups } = useScreenshotGrouping(filteredScreenshots);

  // Modal / Drawer / Lightbox States
  const [lightboxActiveId, setLightboxActiveId] = useState<string | null>(null);
  const [detailsScreenshot, setDetailsScreenshot] = useState<ScreenshotItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [screenshotToDelete, setScreenshotToDelete] = useState<ScreenshotItem | null>(null);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadModuleName, setUploadModuleName] = useState('General');

  const projectsOptions: ProjectOption[] = useMemo(() => {
    const rawProjects =
      (projectsResult as any)?.projects ||
      (projectsResult as any)?.data ||
      (Array.isArray(projectsResult) ? projectsResult : []);

    return rawProjects.map((p: any) => ({
      id: p.id,
      name: p.name || p.title || 'Untitled Project',
    }));
  }, [projectsResult]);

  const handleDownloadScreenshot = async (item: ScreenshotItem) => {
    const targetUrl = item.publicUrl || (await getSignedScreenshotUrl(item.storagePath));
    if (!targetUrl) {
      alert('Unable to generate download link.');
      return;
    }
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = `${item.title.replace(/\s+/g, '_')}.png`;
    link.target = '_blank';
    link.click();
  };

  const handleDeleteScreenshot = (item: ScreenshotItem) => {
    setScreenshotToDelete(item);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle.trim()) return;

    uploadMutation.mutate(
      {
        file: uploadFile,
        title: uploadTitle.trim(),
        description: uploadDescription.trim() || undefined,
        moduleName: uploadModuleName.trim() || 'General',
        takenAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setUploadFile(null);
          setUploadTitle('');
          setUploadDescription('');
          setIsUploadModalOpen(false);
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex flex-col text-zinc-100 font-sans select-none overflow-hidden -mx-4 -mt-4 -mb-16 sm:-mx-6 sm:-mt-6 h-[calc(100vh-3.5rem)] ${className}`}
    >
      {/* Sticky Toolbar */}
      <div className="shrink-0 z-10 px-3 sm:px-4 pt-2 sm:pt-3 pb-2">
        <GalleryToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedModule={selectedModule}
          onModuleChange={setSelectedModule}
          availableModules={availableModules}
          layoutMode={layoutMode}
          onLayoutModeChange={setLayoutMode}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          projects={readOnly || projectId ? [] : projectsOptions}
          selectedProjectId={projectId || selectedProjectId}
          onSelectProject={readOnly || projectId ? undefined : (projId) => setSelectedProjectId(projId)}
          readOnly={readOnly}
        />
      </div>

      {/* Gallery Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 py-4">
        {isLoading ? (
          <GallerySkeleton />
        ) : filteredScreenshots.length === 0 ? (
          <GalleryEmptyState
            onUpload={() => setIsUploadModalOpen(true)}
            readOnly={readOnly}
          />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {milestoneGroups.map((group) => (
              <MilestoneGroup
                key={group.milestoneId || 'unassigned'}
                group={group}
                layoutMode={layoutMode}
                onOpenLightbox={(item) => setLightboxActiveId(item.id)}
                onOpenDetails={setDetailsScreenshot}
                onDownload={handleDownloadScreenshot}
                onDelete={handleDeleteScreenshot}
                readOnly={readOnly}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox Viewer Modal */}
      {lightboxActiveId && (
        <ScreenshotLightbox
          items={filteredScreenshots}
          activeId={lightboxActiveId}
          onClose={() => setLightboxActiveId(null)}
          onDownload={handleDownloadScreenshot}
        />
      )}

      {/* Metadata Drawer */}
      <ScreenshotMetadataDrawer
        screenshot={detailsScreenshot}
        onClose={() => setDetailsScreenshot(null)}
        onDownload={handleDownloadScreenshot}
      />

      {/* Upload Screenshot Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-lg bg-[#0c0c0e] border border-zinc-800 p-6 font-mono space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Image01Icon} size={18} className="text-zinc-400" />
                <h3 className="text-base font-bold text-white font-sans">Upload Progress Screenshot</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Selection */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Select Image File</label>
                <input
                  type="file"
                  required
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setUploadFile(f);
                      if (!uploadTitle) {
                        setUploadTitle(f.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
                      }
                    }
                  }}
                  className="w-full text-xs text-zinc-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                />
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Screenshot Title</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Authentication UI Refresh"
                  className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white outline-none font-mono"
                />
              </div>

              {/* Module Name */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Module / Feature Name</label>
                <input
                  type="text"
                  value={uploadModuleName}
                  onChange={(e) => setUploadModuleName(e.target.value)}
                  placeholder="e.g. Auth, Dashboard, Kanban"
                  className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white outline-none font-mono"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Description / Progress Notes</label>
                <textarea
                  rows={3}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Briefly describe what progress this screenshot represents..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-200 outline-none font-mono custom-scrollbar"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadMutation.isPending || !uploadFile}
                  className="px-4 py-2 rounded-md bg-white text-black font-semibold text-xs hover:bg-zinc-200 shadow disabled:opacity-50"
                >
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload Progress'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Screenshot Dialog */}
      <ConfirmDeleteDialog
        isOpen={Boolean(screenshotToDelete)}
        onClose={() => setScreenshotToDelete(null)}
        onConfirm={() => {
          if (screenshotToDelete) {
            deleteMutation.mutate({ id: screenshotToDelete.id, storagePath: screenshotToDelete.storagePath });
          }
        }}
        title="Delete Screenshot"
        description={`Are you sure you want to delete screenshot "${screenshotToDelete?.title || ''}"? This action cannot be undone.`}
        confirmText="Delete Screenshot"
        isLoading={deleteMutation.isPending}
      />
    </motion.div>
  );
};

export default ScreenshotsTab;
