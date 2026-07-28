import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Add01Icon,
  Notification01Icon,
  CommandIcon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { SidebarTrigger } from '../ui/sidebar';
import type { ViewMode } from '../../types';
import { useNotifications } from '../../modules/notifications/hooks/useNotifications';
import { useMarkNotificationRead } from '../../modules/notifications/hooks/useMarkNotificationRead';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface HeaderProps {
  onOpenCommandMenu: () => void;
  onOpenCreateProject: () => void;
  currentView?: ViewMode;
}

const VIEW_TITLES: Record<ViewMode, string> = {
  dashboard: 'Dashboard Overview',
  projects: 'Client Projects',
  clients: 'Client Management',
  tasks: 'Tasks & Kanban',
  milestones: 'Project Milestones',
  github: 'GitHub Developer Hub',
  docs: 'Documentation & Specs',
  files: 'Files & Credentials Vault',
  timeline: 'Timelines & Roadmap',
  client_portal: 'Client Portals',
  'share-links': 'Share Links & Access',
  payments: 'Finances & Deliverables',
  changelog: 'Project Changelog & Releases',
  notes: 'Private Admin Notes',
  deployments: 'Deployments & Environments',
  notifications: 'Notification Center',
  settings: 'System Settings',
};

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandMenu,
  onOpenCreateProject,
  currentView = 'dashboard',
}) => {
  const navigate = useNavigate();
  const [isBellOpen, setIsBellOpen] = useState(false);
  const { data: latestList = [] } = useNotifications(
    {
      search: '',
      tab: 'unread',
      category: 'all',
      priority: 'all',
      type: 'all',
      sort: 'newest',
    },
    { enabled: isBellOpen }
  );
  const { markAll } = useMarkNotificationRead();

  // Derive unread count from fetched list (only populated when bell was opened)
  const unreadCount = latestList.length;

  const currentTitle = VIEW_TITLES[currentView] || 'Workspace';

  return (
    <header className="h-14 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,12,0.8)] backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 transition-all select-none font-mono">
      {/* Left: Sidebar Toggle Icon & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <SidebarTrigger className="text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0" />
        <div className="h-4 w-[1px] bg-zinc-800 shrink-0" />
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="text-xs font-mono text-zinc-400 flex-nowrap">
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink href="#" className="hover:text-white transition-colors whitespace-nowrap">
                Velis Studio Pro
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:inline-flex text-zinc-600 shrink-0" />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="font-semibold text-white truncate max-w-[130px] sm:max-w-none">
                {currentTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right: Global Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={onOpenCommandMenu}
          className="h-8 w-8 sm:w-auto px-0 sm:px-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center justify-center sm:justify-start gap-2.5 transition-all cursor-pointer shadow-inner shrink-0"
          title="Search or command (Ctrl+K)"
        >
          <HugeiconsIcon icon={Search01Icon} size={15} className="text-zinc-400 shrink-0" />
          <span className="hidden sm:inline">Search or command...</span>
          <kbd className="hidden md:flex items-center gap-0.5 text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-sans">
            <HugeiconsIcon icon={CommandIcon} size={10} />
            <span>K</span>
          </kbd>
        </button>

        {/* Create Project Button */}
        <button
          type="button"
          onClick={onOpenCreateProject}
          className="h-8 w-8 sm:w-auto px-0 sm:px-3 rounded-lg bg-[#FAFAFA] text-[#050505] hover:bg-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_4px_16px_rgba(255,255,255,0.15)] border border-white/20 shrink-0"
          title="New Project"
        >
          <HugeiconsIcon icon={Add01Icon} size={15} className="shrink-0" />
          <span className="hidden sm:inline">New Project</span>
        </button>

        {/* Notifications Bell Dropdown */}
        <div className="relative shrink-0">
          <DropdownMenu open={isBellOpen} onOpenChange={setIsBellOpen}>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer relative"
                  title="Notifications"
                >
                  <HugeiconsIcon icon={Notification01Icon} size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black font-mono text-[9px] font-bold rounded-full flex items-center justify-center border border-zinc-800 shadow">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              }
            />

            <DropdownMenuContent
              align="end"
              className="w-80 p-0 bg-[rgba(12,12,14,0.96)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl text-xs font-mono overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-zinc-800/80 bg-zinc-950/60">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-sans">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAll.mutate()}
                    className="text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
              </div>

              {/* Latest Items List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/40 custom-scrollbar">
                {latestList.length === 0 ? (
                  <div className="p-6 text-center text-zinc-500 font-mono text-xs">
                    No unread notifications
                  </div>
                ) : (
                  latestList.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate('/app/notifications')}
                      className="p-3 hover:bg-zinc-900/60 transition-colors cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">
                          {item.category.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white font-sans line-clamp-1">
                        {item.title}
                      </h5>
                      {item.description && (
                        <p className="text-[11px] text-zinc-400 line-clamp-1 font-mono">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer View All */}
              <div className="p-2 border-t border-zinc-800/80 bg-zinc-950/80 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/app/notifications')}
                  className="w-full py-1.5 text-xs text-zinc-300 hover:text-white font-mono inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View All Notifications</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
