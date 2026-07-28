import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FolderTreeNode } from '../lib/types/folder';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Folder01Icon,
  FolderOpenIcon,
  ArrowRight01Icon,
} from '../lib/utils/folder-icons';
import { FolderContextMenu } from './FolderContextMenu';
import { FolderRenameInput } from './FolderRenameInput';
import { toast } from '../../../components/ui/toast';

interface FolderNodeProps {
  node: FolderTreeNode;
  isExpanded: boolean;
  isSelected: boolean;
  expandedIds?: Set<string>;
  onToggleExpand: (id: string) => void;
  onSelect: (node: FolderTreeNode) => void;
  onNewSubfolder: (node: FolderTreeNode) => void;
  onRename: (node: FolderTreeNode, newName: string) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

export const FolderNode: React.FC<FolderNodeProps> = ({
  node,
  isExpanded,
  isSelected,
  expandedIds,
  onToggleExpand,
  onSelect,
  onNewSubfolder,
  onRename,
  onDelete,
  readOnly = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const hasChildren = Boolean(node.children && node.children.length > 0);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(node.name);
    toast.success(`Copied folder path "${node.name}" to clipboard`);
  };

  const nodeIsExpanded = expandedIds ? expandedIds.has(node.id) || isExpanded : isExpanded;

  return (
    <div className="select-none font-sans text-xs">
      <motion.div
        whileHover={{ backgroundColor: 'rgba(39, 39, 42, 0.4)' }}
        onClick={() => onSelect(node)}
        onDoubleClick={() => onToggleExpand(node.id)}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsContextMenuOpen(true);
        }}
        style={{ paddingLeft: node.depth === 0 ? '6px' : '4px' }}
        className={`group relative flex items-center justify-between py-1.5 pr-2 rounded-md transition-colors cursor-pointer text-xs ${
          isSelected
            ? 'text-white font-medium bg-zinc-800/30'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
        }`}
      >


        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {/* Expand/Collapse Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className={`p-0.5 rounded hover:bg-zinc-700/60 transition-transform cursor-pointer ${
              hasChildren ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={12}
              className={`text-zinc-500 transition-transform duration-200 ${
                nodeIsExpanded ? 'rotate-90 text-zinc-300' : ''
              }`}
            />
          </button>

          {/* Folder Icon */}
          <HugeiconsIcon
            icon={nodeIsExpanded ? FolderOpenIcon : Folder01Icon}
            size={14}
            className={`shrink-0 transition-colors ${
              isSelected
                ? 'text-amber-300'
                : 'text-amber-400/90 group-hover:text-amber-300'
            }`}
          />

          {/* Name or Rename Input */}
          {isEditing ? (
            <div onClick={(e) => e.stopPropagation()}>
              <FolderRenameInput
                initialName={node.name}
                onSave={(newName) => {
                  setIsEditing(false);
                  onRename(node, newName);
                }}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <span className="truncate flex-1 font-mono text-[11px]">{node.name}</span>
          )}
        </div>

        {/* Dropdown Menu Popup */}
        {isContextMenuOpen && (
          <div
            className="absolute right-2 top-8 z-40"
            onClick={(e) => e.stopPropagation()}
          >
            <FolderContextMenu
              folder={node}
              onNewSubfolder={(n) => {
                setIsContextMenuOpen(false);
                onNewSubfolder(n);
              }}
              onRename={() => {
                setIsContextMenuOpen(false);
                setIsEditing(true);
              }}
              onDelete={(n) => {
                setIsContextMenuOpen(false);
                if (window.confirm(`Delete folder "${n.name}"?`)) {
                  onDelete(n.id);
                }
              }}
              onCopyPath={() => {
                setIsContextMenuOpen(false);
                handleCopyPath();
              }}
              readOnly={readOnly}
            />
          </div>
        )}
      </motion.div>

      {/* Recursive Render Children Nodes with VS Code Vertical Indentation Guide Line */}
      <AnimatePresence>
        {nodeIsExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden relative border-l border-zinc-800/80 hover:border-zinc-700/80 ml-[17px] pl-1 space-y-0.5 my-0.5 transition-colors"
          >
            {node.children!.map((child) => (
              <FolderNode
                key={child.id}
                node={child}
                isExpanded={expandedIds ? expandedIds.has(child.id) : false}
                isSelected={isSelected}
                expandedIds={expandedIds}
                onToggleExpand={onToggleExpand}
                onSelect={onSelect}
                onNewSubfolder={onNewSubfolder}
                onRename={onRename}
                onDelete={onDelete}
                readOnly={readOnly}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FolderNode;
