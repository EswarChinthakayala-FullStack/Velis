import React, { useState } from 'react';
import type { FileItem, FolderItem } from '../lib/types/file';
import { formatBytes, getCategoryFromMimeOrExt } from '../lib/utils/mime-utils';
import { getFileCategoryIcon, Folder01Icon } from '../lib/utils/file-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoreVerticalIcon, Download01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { FileContextMenu } from './FileContextMenu';
import { format } from 'date-fns';

import { ConfirmDeleteDialog } from '../../../components/ui/confirm-delete-dialog';

interface FileTableProps {
  folders: FolderItem[];
  files: FileItem[];
  onOpenFolder: (folder: FolderItem) => void;
  onPreview: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onRename?: (file: FileItem) => void;
  onMove?: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
  onDeleteFolder?: (folderId: string) => void;
  readOnly?: boolean;
}

export const FileTable: React.FC<FileTableProps> = ({
  folders,
  files,
  onOpenFolder,
  onPreview,
  onDownload,
  onRename,
  onMove,
  onDelete,
  onDeleteFolder,
  readOnly = false,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [activeFile, setActiveFile] = useState<FileItem | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<FolderItem | null>(null);

  if (folders.length === 0 && files.length === 0) return null;

  const handleOpenMenu = (e: React.MouseEvent, file: FileItem) => {
    e.stopPropagation();
    if (activeMenuId === file.id) {
      setActiveMenuId(null);
      setMenuPos(null);
      setActiveFile(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.right });
      setActiveMenuId(file.id);
      setActiveFile(file);
    }
  };

  const closeMenu = () => {
    setActiveMenuId(null);
    setMenuPos(null);
    setActiveFile(null);
  };

  return (
    <div className="w-full overflow-x-auto custom-scrollbar rounded-lg border border-zinc-800/80 bg-[#0c0c0e]/80 shadow-md font-mono text-xs select-none relative">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-zinc-900/90 border-b border-zinc-800 text-[11px] text-zinc-400 font-semibold uppercase tracking-wider backdrop-blur-md">
          <tr>
            <th className="py-2.5 px-4">Name</th>
            <th className="py-2.5 px-4 hidden sm:table-cell">Type</th>
            <th className="py-2.5 px-4 hidden sm:table-cell">Size</th>
            <th className="py-2.5 px-4 hidden md:table-cell">Updated</th>
            <th className="py-2.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
          {/* Folders */}
          {folders.map((folder) => (
            <tr
              key={folder.id}
              onClick={() => onOpenFolder(folder)}
              className="hover:bg-zinc-800/40 transition-colors cursor-pointer group"
            >
              <td className="py-2.5 px-4 font-sans font-medium text-white flex items-center gap-2.5">
                <HugeiconsIcon icon={Folder01Icon} size={16} className="text-amber-400 shrink-0" />
                <span className="truncate max-w-xs">{folder.name}</span>
              </td>
              <td className="py-2.5 px-4 hidden sm:table-cell text-zinc-500 font-mono">Folder</td>
              <td className="py-2.5 px-4 hidden sm:table-cell text-zinc-500 font-mono">—</td>
              <td className="py-2.5 px-4 hidden md:table-cell text-zinc-500 font-mono">
                {folder.updatedAt ? format(new Date(folder.updatedAt), 'MMM d, yyyy') : '—'}
              </td>
              <td className="py-2.5 px-4 text-right font-mono">
                {!readOnly && onDeleteFolder && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFolderToDelete(folder);
                    }}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete folder"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                  </button>
                )}
              </td>
            </tr>
          ))}

          {/* Files */}
          {files.map((file) => {
            const category = getCategoryFromMimeOrExt(file.mimeType, file.name);
            const IconComponent = getFileCategoryIcon(category, file.name);

            return (
              <tr
                key={file.id}
                onClick={() => onPreview(file)}
                className="hover:bg-zinc-800/40 transition-colors cursor-pointer group relative"
              >
                <td className="py-2.5 px-4 font-sans font-medium text-zinc-200 group-hover:text-white flex items-center gap-2.5">
                  <HugeiconsIcon icon={IconComponent} size={16} className="text-zinc-400 shrink-0" />
                  <span className="truncate max-w-xs sm:max-w-md">{file.name}</span>
                </td>
                <td className="py-2.5 px-4 hidden sm:table-cell text-zinc-400 font-mono capitalize">
                  {category}
                </td>
                <td className="py-2.5 px-4 hidden sm:table-cell text-zinc-400 font-mono">
                  {formatBytes(file.size)}
                </td>
                <td className="py-2.5 px-4 hidden md:table-cell text-zinc-400 font-mono">
                  {file.updatedAt ? format(new Date(file.updatedAt), 'MMM d, yyyy') : '—'}
                </td>
                <td className="py-2.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(file);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Download"
                    >
                      <HugeiconsIcon icon={Download01Icon} size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenMenu(e, file)}
                      className="p-1 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Actions"
                    >
                      <HugeiconsIcon icon={MoreVerticalIcon} size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Floating Context Menu Overlay */}
      {activeMenuId && menuPos && activeFile && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
            }}
          />
          <div
            className="fixed z-[9999]"
            style={{
              top: `${menuPos.top}px`,
              left: `${Math.max(16, menuPos.left - 176)}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <FileContextMenu
              file={activeFile}
              onPreview={(f) => {
                closeMenu();
                onPreview(f);
              }}
              onDownload={(f) => {
                closeMenu();
                onDownload(f);
              }}
              onRename={(f) => {
                closeMenu();
                if (onRename) onRename(f);
              }}
              onMove={(f) => {
                closeMenu();
                if (onMove) onMove(f);
              }}
              onDelete={(f) => {
                closeMenu();
                if (onDelete) onDelete(f);
              }}
              readOnly={readOnly}
            />
          </div>
        </>
      )}

      {/* Confirm Delete Folder Dialog */}
      <ConfirmDeleteDialog
        isOpen={Boolean(folderToDelete)}
        onClose={() => setFolderToDelete(null)}
        onConfirm={() => {
          if (folderToDelete && onDeleteFolder) {
            onDeleteFolder(folderToDelete.id);
          }
        }}
        title="Delete Folder"
        description={`Are you sure you want to delete folder "${folderToDelete?.name || ''}" and all its contents? This action cannot be undone.`}
        confirmText="Delete Folder"
      />
    </div>
  );
};

export default FileTable;
