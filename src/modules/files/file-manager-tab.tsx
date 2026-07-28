import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useProjectFiles, useCreateFolder, useRenameFile, useDeleteFile, useDeleteFolder } from '../../lib/supabase/queries/files';
import { useProjects } from '../projects/hooks/useProjects';
import type { FileItem, FolderItem, FileViewMode } from './lib/types/file';

import { FileToolbar, type ProjectOption } from './components/FileToolbar';
import { BreadcrumbNavigation } from './components/BreadcrumbNavigation';
import { FolderGrid } from './components/FolderGrid';
import { FileGrid } from './components/FileGrid';
import { FileTable } from './components/FileTable';
import { FilePreviewDrawer } from './components/FilePreviewDrawer';
import { ConfirmDeleteDialog } from '../../components/ui/confirm-delete-dialog';
import { UploadQueue } from './components/UploadQueue';
import { EmptyFileState } from './components/EmptyFileState';
import { FileSkeleton } from './components/FileSkeleton';
import { FolderTree } from './folder-tree';

import { useFolderNavigation } from './hooks/useFolderNavigation';
import { useSearchFiles } from './hooks/useSearchFiles';
import { useUploadFiles } from './hooks/useUploadFiles';
import { getSignedFileUrl } from './lib/utils/signed-url';

import { HugeiconsIcon } from '@hugeicons/react';
import { FolderAddIcon, Upload01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface FileManagerTabProps {
  projectId?: string;
  readOnly?: boolean;
  className?: string;
}

export const FileManagerTab: React.FC<FileManagerTabProps> = ({
  projectId,
  readOnly = false,
  className = '',
}) => {
  // Project selection state - lock to projectId when provided
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || 'all');
  const { data: projectsResult } = useProjects();

  const activeProjectId = projectId || (selectedProjectId === 'all' ? undefined : selectedProjectId);

  // Folder navigation state
  const {
    currentFolderId,
    folderHistory,
    navigateToFolder,
    navigateToBreadcrumb,
  } = useFolderNavigation();

  // Queries & Mutations
  const { data, isLoading } = useProjectFiles(activeProjectId, currentFolderId);
  const files = data?.files || [];
  const folders = data?.folders || [];

  const createFolderMutation = useCreateFolder(activeProjectId, currentFolderId);
  const renameFileMutation = useRenameFile(activeProjectId, currentFolderId);
  const deleteFileMutation = useDeleteFile(activeProjectId, currentFolderId);
  const deleteFolderMutation = useDeleteFolder(activeProjectId, currentFolderId);

  // Upload Queue Hook
  const {
    tasks: uploadTasks,
    startUploads,
    cancelTask,
    retryTask,
    clearCompleted,
  } = useUploadFiles(activeProjectId, currentFolderId);

  // View state & modals
  const [viewMode, setViewMode] = useState<FileViewMode>('grid');
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameTargetFile, setRenameTargetFile] = useState<FileItem | null>(null);
  const [newFileNameInput, setNewFileNameInput] = useState('');
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);

  // Search & Filter hook
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    filteredFiles,
    filteredFolders,
  } = useSearchFiles(files, folders);

  // Dropzone setup
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (readOnly) return;
      startUploads(acceptedFiles);
    },
    [readOnly, startUploads]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // Allow clicking only via explicit Upload button
    noKeyboard: true,
  });

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

  const handleDownloadFile = async (file: FileItem) => {
    const targetUrl = file.publicUrl || (await getSignedFileUrl(file.storagePath));
    if (!targetUrl) {
      alert('Unable to generate download URL for this file.');
      return;
    }
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = file.name;
    link.target = '_blank';
    link.click();
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolderMutation.mutate(newFolderName.trim(), {
      onSuccess: () => {
        setNewFolderName('');
        setIsCreateFolderModalOpen(false);
      },
    });
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTargetFile || !newFileNameInput.trim()) return;
    renameFileMutation.mutate(
      { fileId: renameTargetFile.id, newName: newFileNameInput.trim() },
      {
        onSuccess: () => {
          setRenameTargetFile(null);
          setNewFileNameInput('');
        },
      }
    );
  };

  const handleDeleteFile = (file: FileItem) => {
    setFileToDelete(file);
  };

  const handleDeleteFolder = (folderIdToDelete: string) => {
    deleteFolderMutation.mutate(folderIdToDelete);
  };

  const hasContent = filteredFolders.length > 0 || filteredFiles.length > 0;

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col text-zinc-100 font-sans select-none overflow-hidden -mx-4 -mt-4 -mb-16 sm:-mx-6 sm:-mt-6 h-[calc(100vh-3.5rem)] ${className}`}
    >
      <input {...getInputProps()} />

      {/* Drag Active Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md border-2 border-dashed border-white flex flex-col items-center justify-center p-6 text-center space-y-3 font-mono">
          <HugeiconsIcon icon={Upload01Icon} size={48} className="text-white animate-bounce" />
          <h3 className="text-lg font-bold text-white">Drop files to upload</h3>
          <p className="text-xs text-zinc-400">Files will upload directly to Supabase Storage</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="shrink-0 z-10 px-3 sm:px-4 pt-2 sm:pt-3 pb-2">
        <FileToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOrder={sortOrder}
          onSortOrderToggle={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          onOpenUploadModal={() => {
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.click();
          }}
          onOpenCreateFolderModal={() => setIsCreateFolderModalOpen(true)}
          projects={readOnly || projectId ? [] : projectsOptions}
          selectedProjectId={projectId || selectedProjectId}
          onSelectProject={readOnly || projectId ? undefined : (projId) => setSelectedProjectId(projId)}
          readOnly={readOnly}
        />
      </div>

      {/* Split Layout: Left Folder Tree (desktop) + Right Main Viewport */}
      <div className="flex flex-1 overflow-hidden">
        <FolderTree
          projectId={activeProjectId}
          selectedFolderId={currentFolderId}
          onSelectFolder={(folder) => {
            if (!folder) {
              navigateToBreadcrumb(null);
            } else {
              navigateToFolder(folder as any);
            }
          }}
          readOnly={readOnly}
          className="hidden md:flex"
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Breadcrumb Navigation */}
          <div className="shrink-0 px-4 py-1 border-b border-zinc-800/40 bg-[#09090b]/40">
            <BreadcrumbNavigation history={folderHistory} onNavigate={navigateToBreadcrumb} />
          </div>

          {/* Main File Browser Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 py-4">
            {isLoading ? (
              <FileSkeleton />
            ) : !hasContent ? (
              <EmptyFileState
                onUpload={() => {
                  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                  if (fileInput) fileInput.click();
                }}
                onCreateFolder={() => setIsCreateFolderModalOpen(true)}
                readOnly={readOnly}
              />
            ) : viewMode === 'grid' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                <FolderGrid
                  folders={filteredFolders}
                  onOpenFolder={navigateToFolder}
                  onDeleteFolder={handleDeleteFolder}
                  readOnly={readOnly}
                />
                <FileGrid
                  files={filteredFiles}
                  onPreview={setPreviewFile}
                  onDownload={handleDownloadFile}
                  onRename={(f) => {
                    setRenameTargetFile(f);
                    setNewFileNameInput(f.name);
                  }}
                  onDelete={handleDeleteFile}
                  readOnly={readOnly}
                />
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                <FileTable
                  folders={filteredFolders}
                  files={filteredFiles}
                  onOpenFolder={navigateToFolder}
                  onPreview={setPreviewFile}
                  onDownload={handleDownloadFile}
                  onRename={(f) => {
                    setRenameTargetFile(f);
                    setNewFileNameInput(f.name);
                  }}
                  onDelete={handleDeleteFile}
                  onDeleteFolder={handleDeleteFolder}
                  readOnly={readOnly}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Manager Floating Panel */}
      <UploadQueue
        tasks={uploadTasks}
        onCancel={cancelTask}
        onRetry={retryTask}
        onClear={clearCompleted}
      />

      {/* Slide-over File Preview Drawer */}
      <FilePreviewDrawer
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownloadFile}
      />

      {/* Create Folder Modal */}
      {isCreateFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg bg-[#0c0c0e] border border-zinc-800 p-6 font-mono space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={FolderAddIcon} size={18} className="text-zinc-400" />
                <h3 className="text-base font-bold text-white font-sans">New Folder</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateFolderModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Folder Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Design Assets"
                  className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateFolderModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFolderMutation.isPending}
                  className="px-4 py-2 rounded-md bg-white text-black font-semibold text-xs hover:bg-zinc-200"
                >
                  {createFolderMutation.isPending ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename File Modal */}
      {renameTargetFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg bg-[#0c0c0e] border border-zinc-800 p-6 font-mono space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white font-sans">Rename File</h3>
              <button
                type="button"
                onClick={() => setRenameTargetFile(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>

            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">File Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newFileNameInput}
                  onChange={(e) => setNewFileNameInput(e.target.value)}
                  className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-white outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setRenameTargetFile(null)}
                  className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renameFileMutation.isPending}
                  className="px-4 py-2 rounded-md bg-white text-black font-semibold text-xs hover:bg-zinc-200"
                >
                  {renameFileMutation.isPending ? 'Saving...' : 'Rename'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete File Dialog */}
      <ConfirmDeleteDialog
        isOpen={Boolean(fileToDelete)}
        onClose={() => setFileToDelete(null)}
        onConfirm={() => {
          if (fileToDelete) {
            deleteFileMutation.mutate({ fileId: fileToDelete.id, storagePath: fileToDelete.storagePath });
          }
        }}
        title="Delete File"
        description={`Are you sure you want to delete "${fileToDelete?.name || ''}"? This file will be permanently removed from storage.`}
        confirmText="Delete File"
        isLoading={deleteFileMutation.isPending}
      />
    </div>
  );
};

export default FileManagerTab;
