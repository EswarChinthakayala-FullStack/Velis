import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFolderTree, useCreateFolderMutation, useRenameFolderMutation, useDeleteFolderMutation } from '../../lib/supabase/queries/folders';
import { useExpandedFolders } from './hooks/useExpandedFolders';
import type { FolderTreeNode } from './lib/types/folder';
import { FolderNode } from './components/FolderNode';
import { FolderSkeleton } from './components/FolderSkeleton';
import { FolderTreeEmptyState } from './components/FolderTreeEmptyState';
import { HugeiconsIcon } from '@hugeicons/react';
import { FolderAddIcon, Folder01Icon } from './lib/utils/folder-icons';
import { Search01Icon, Loading02Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface FolderTreeProps {
  projectId?: string | null;
  selectedFolderId?: string | null;
  onSelectFolder?: (folder: FolderTreeNode | null) => void;
  readOnly?: boolean;
  className?: string;
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  projectId,
  selectedFolderId = null,
  onSelectFolder,
  readOnly = false,
  className = '',
}) => {
  const { data: treeNodes = [], isLoading } = useFolderTree(projectId);
  const { expandedIds, toggleExpand, expandFolder } = useExpandedFolders();

  const [searchQuery, setSearchQuery] = useState('');
  const [targetSubfolderNode, setTargetSubfolderNode] = useState<FolderTreeNode | null>(null);
  const [newSubfolderName, setNewSubfolderName] = useState('');

  const createFolderMutation = useCreateFolderMutation(projectId);
  const renameFolderMutation = useRenameFolderMutation(projectId);
  const deleteFolderMutation = useDeleteFolderMutation(projectId);

  // Filter tree nodes when searching
  const filteredTreeNodes = useMemo(() => {
    if (!searchQuery.trim()) return treeNodes;
    const q = searchQuery.toLowerCase();

    const filterNodes = (nodes: FolderTreeNode[]): FolderTreeNode[] => {
      return nodes
        .map((n) => {
          const nameMatches = n.name.toLowerCase().includes(q);
          const childMatches = n.children ? filterNodes(n.children) : [];
          if (nameMatches || childMatches.length > 0) {
            return { ...n, children: childMatches };
          }
          return null;
        })
        .filter(Boolean) as FolderTreeNode[];
    };

    return filterNodes(treeNodes);
  }, [treeNodes, searchQuery]);

  const handleCreateSubfolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubfolderName.trim()) return;

    createFolderMutation.mutate(
      {
        name: newSubfolderName.trim(),
        parentId: targetSubfolderNode ? targetSubfolderNode.id : null,
      },
      {
        onSuccess: (newFolder) => {
          if (targetSubfolderNode) {
            expandFolder(targetSubfolderNode.id);
          }
          setNewSubfolderName('');
          setTargetSubfolderNode(null);
        },
      }
    );
  };

  const handleRenameFolder = (node: FolderTreeNode, newName: string) => {
    renameFolderMutation.mutate({ folderId: node.id, newName });
  };

  const handleDeleteFolder = (folderId: string) => {
    deleteFolderMutation.mutate(folderId);
  };

  return (
    <aside className={`w-60 shrink-0 flex flex-col h-full border-r border-zinc-800/60 bg-[#09090b]/50 select-none ${className}`}>
      {/* Header & Quick Actions */}
      <div className="p-3 shrink-0 border-b border-zinc-800/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 tracking-wider uppercase font-mono">
            <HugeiconsIcon icon={Folder01Icon} size={14} className="text-zinc-500" />
            <span>Folder Tree</span>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={() => {
                setTargetSubfolderNode(null);
                setNewSubfolderName('');
                setTargetSubfolderNode({ id: 'root' } as any);
              }}
              className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="New Root Folder"
            >
              <HugeiconsIcon icon={FolderAddIcon} size={13} />
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <HugeiconsIcon icon={Search01Icon} size={12} className="absolute left-2.5 top-2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter folders..."
            className="w-full h-7 pl-7 pr-2 bg-zinc-900/90 border border-zinc-800 focus:border-zinc-700 text-zinc-200 text-[11px] font-mono rounded-md outline-none placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Tree Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {isLoading ? (
          <FolderSkeleton />
        ) : filteredTreeNodes.length === 0 ? (
          <FolderTreeEmptyState
            onCreateFolder={() => {
              setTargetSubfolderNode({ id: 'root' } as any);
            }}
            readOnly={readOnly}
          />
        ) : (
          <div className="space-y-0.5">
            {/* Root item option */}
            <div
              onClick={() => onSelectFolder && onSelectFolder(null)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs font-mono transition-colors ${
                selectedFolderId === null
                  ? 'text-white font-medium bg-zinc-800/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
              }`}
            >
              <HugeiconsIcon icon={Folder01Icon} size={14} className="text-zinc-400" />
              <span>Root Directory</span>
            </div>

            {/* Tree Nodes */}
            {filteredTreeNodes.map((node) => (
              <FolderNode
                key={node.id}
                node={node}
                isExpanded={expandedIds.has(node.id) || Boolean(searchQuery.trim())}
                isSelected={selectedFolderId === node.id}
                expandedIds={expandedIds}
                onToggleExpand={toggleExpand}
                onSelect={(n) => onSelectFolder && onSelectFolder(n)}
                onNewSubfolder={(n) => setTargetSubfolderNode(n)}
                onRename={handleRenameFolder}
                onDelete={handleDeleteFolder}
                readOnly={readOnly}
              />
            ))}
          </div>
        )}
      </div>

      {/* Subfolder Creation Centered Modal Dialog */}
      {targetSubfolderNode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl bg-[#0c0c0e] border border-zinc-800 p-5 font-mono text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={FolderAddIcon} size={16} className="text-zinc-400" />
                <h3 className="text-sm font-bold text-white font-sans truncate">
                  {targetSubfolderNode.id === 'root'
                    ? 'New Root Folder'
                    : `New Subfolder in "${targetSubfolderNode.name}"`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTargetSubfolderNode(null)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubfolder} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Folder Name</label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newSubfolderName}
                  onChange={(e) => setNewSubfolderName(e.target.value)}
                  placeholder="e.g. Design Assets"
                  className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-md text-xs text-white outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setTargetSubfolderNode(null)}
                  className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFolderMutation.isPending}
                  className="px-4 py-2 rounded-md bg-white text-black font-semibold text-xs hover:bg-zinc-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {createFolderMutation.isPending ? (
                    <>
                      <HugeiconsIcon icon={Loading02Icon} size={13} className="animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Folder</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};

export default FolderTree;
