import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DashboardSquare01Icon,
  FolderCheckIcon,
  GitBranchIcon,
  FileCodeIcon,
  FolderCodeIcon,
  Clock01Icon,
  UserGroupIcon,
  Settings01Icon,
  SidebarLeftIcon,
  SidebarRightIcon
} from '@hugeicons/core-free-icons';
import type { ViewMode } from '../../types';
import { AppLogo } from '../ui/AppLogo';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse
}) => {
  const navItems: { id: ViewMode; label: string; icon: typeof DashboardSquare01Icon }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardSquare01Icon },
    { id: 'projects', label: 'Projects', icon: FolderCheckIcon },
    { id: 'github', label: 'GitHub Sync', icon: GitBranchIcon },
    { id: 'docs', label: 'Living Docs', icon: FileCodeIcon },
    { id: 'files', label: 'Vault Files', icon: FolderCodeIcon },
    { id: 'timeline', label: 'Timelines', icon: Clock01Icon },
    { id: 'clients', label: 'Clients', icon: UserGroupIcon },
    { id: 'settings', label: 'Settings', icon: Settings01Icon }
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-4 top-4 bottom-4 z-40 flex flex-col justify-between rounded-[24px] bg-[rgba(24,24,27,0.72)] backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-3 overflow-hidden select-none"
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-2 py-3 mb-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <AppLogo size={30} />
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col"
              >
                <span className="text-base font-bold text-white tracking-wider leading-none">
                  VELIS
                </span>
                <span className="text-[10px] text-zinc-400 tracking-tight font-mono mt-0.5">
                  STUDIO PRO
                </span>
              </motion.div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <HugeiconsIcon
              icon={isCollapsed ? SidebarRightIcon : SidebarLeftIcon}
              size={16}
            />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-[16px] text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavBackground"
                    className="absolute inset-0 rounded-[16px] bg-zinc-800/80 border border-white/10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 shrink-0">
                  <HugeiconsIcon icon={item.icon} size={22} />
                </span>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative z-10 truncate text-xs"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User / Workspace Footer */}
      <div className="pt-3 border-t border-zinc-800/60">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Alex Vance"
            className="w-8 h-8 rounded-full border border-zinc-700 shrink-0 object-cover"
          />
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-zinc-200 truncate">
                Alex Vance
              </span>
              <span className="text-[10px] text-zinc-500 font-mono truncate">
                Lead Architect
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
