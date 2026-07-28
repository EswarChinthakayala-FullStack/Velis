import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Folder01Icon,
  GitBranchIcon,
  FileCodeIcon,
  FolderCheckIcon,
  Settings01Icon,
  UserGroupIcon,
  Add01Icon,
  Cancel01Icon
} from '@hugeicons/core-free-icons';
import type { ViewMode } from '../../types';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: ViewMode) => void;
  onOpenCreateProject?: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onOpenCreateProject
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items = [
    {
      id: 'dash',
      label: 'Go to Dashboard',
      category: 'Navigation',
      icon: Folder01Icon,
      action: () => {
        onSelectView('dashboard');
        onClose();
      }
    },
    {
      id: 'proj',
      label: 'View All Projects',
      category: 'Navigation',
      icon: FolderCheckIcon,
      action: () => {
        onSelectView('projects');
        onClose();
      }
    },
    {
      id: 'new-proj',
      label: 'Create New Project...',
      category: 'Actions',
      icon: Add01Icon,
      action: () => {
        onClose();
        if (onOpenCreateProject) onOpenCreateProject();
      }
    },
    {
      id: 'github',
      label: 'GitHub Integration & Repositories',
      category: 'Navigation',
      icon: GitBranchIcon,
      action: () => {
        onSelectView('github');
        onClose();
      }
    },
    {
      id: 'docs',
      label: 'Technical Documentation & Architecture Specs',
      category: 'Navigation',
      icon: FileCodeIcon,
      action: () => {
        onSelectView('docs');
        onClose();
      }
    },
    {
      id: 'clients',
      label: 'Client Collaboration Portals',
      category: 'Navigation',
      icon: UserGroupIcon,
      action: () => {
        onSelectView('client_portal');
        onClose();
      }
    },
    {
      id: 'settings',
      label: 'Workspace & API Settings',
      category: 'Navigation',
      icon: Settings01Icon,
      action: () => {
        onSelectView('settings');
        onClose();
      }
    }
  ];

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[rgba(17,17,19,0.95)] backdrop-blur-2xl border border-[rgba(255,255,255,0.14)] rounded-lg shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-zinc-800/80 gap-3">
              <HugeiconsIcon icon={Search01Icon} size={18} className="text-zinc-400 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search workspace..."
                className="w-full bg-transparent text-[#FAFAFA] placeholder-zinc-500 text-base focus:outline-none"
              />
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                ESC
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>

            {/* Command List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredItems.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-zinc-500">
                  No matching commands found.
                </div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm text-[#D4D4D8] hover:text-white hover:bg-zinc-800/60 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <HugeiconsIcon icon={item.icon} size={16} className="text-zinc-400" />
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-zinc-950/80 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <span>Navigate with arrows</span>
                <span>•</span>
                <span>Press Enter to select</span>
              </div>
              <span className="font-mono">Velis Raycast Core</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
