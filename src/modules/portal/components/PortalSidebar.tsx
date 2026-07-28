import React from 'react';
import { AppLogo } from '../../../components/ui/AppLogo';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DashboardSquare01Icon,
  Clock01Icon,
  Flag01Icon,
  Image01Icon,
  FileCodeIcon,
  FolderCodeIcon,
  Cancel01Icon,
  MoneyBagIcon,
  Tag01Icon,
  RocketIcon,
} from '@hugeicons/core-free-icons';
import { useSharePortalSettings } from '../../settings/hooks/useSettings';

export type PortalTabType = 'overview' | 'timeline' | 'milestones' | 'screenshots' | 'docs' | 'files' | 'payments' | 'changelog' | 'deployments';

interface PortalSidebarProps {
  activeTab: PortalTabType;
  onSelectTab: (tab: PortalTabType) => void;
  projectName?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: PortalTabType;
  label: string;
  icon: any;
  description?: string;
  settingKey?: 'showTimeline' | 'showPayments' | 'showChangelog' | 'showDeployments' | 'showDocs';
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { id: 'overview', label: 'Project Dashboard', icon: DashboardSquare01Icon, description: 'Summary & status' },
      { id: 'timeline', label: 'Timeline', icon: Clock01Icon, description: 'Progress updates', settingKey: 'showTimeline' },
      { id: 'payments', label: 'Finances & Release', icon: MoneyBagIcon, description: 'Payments & deliverables', settingKey: 'showPayments' },
    ],
  },
  {
    label: 'Deliverables',
    items: [
      { id: 'milestones', label: 'Milestones', icon: Flag01Icon, description: 'Roadmap tracking' },
      { id: 'changelog', label: 'Changelog', icon: Tag01Icon, description: 'Version history & releases', settingKey: 'showChangelog' },
      { id: 'deployments', label: 'Environments', icon: RocketIcon, description: 'Live app URLs & status', settingKey: 'showDeployments' },
      { id: 'screenshots', label: 'Gallery', icon: Image01Icon, description: 'Screenshots & demos' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { id: 'docs', label: 'Documentation', icon: FileCodeIcon, description: 'Technical specs', settingKey: 'showDocs' },
      { id: 'files', label: 'File Vault', icon: FolderCodeIcon, description: 'Assets & exports' },
    ],
  },
];

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  activeTab,
  onSelectTab,
  projectName = 'Client Portal',
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { data: portalSettings } = useSharePortalSettings();

  const isItemVisible = (item: NavItem): boolean => {
    if (!item.settingKey) return true;
    if (!portalSettings) return true;
    return portalSettings[item.settingKey] !== false;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0a0b] border-r border-zinc-800/60 w-[260px] select-none font-sans">
      {/* ── Header / Brand ── */}
      <div className="px-5 pt-5 pb-4 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
              <AppLogo size={18} showText={false} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[13px] font-semibold text-zinc-100 tracking-tight truncate leading-tight">
                {projectName}
              </h2>
              <span className="text-[10px] text-zinc-500 font-medium leading-tight">Client Portal</span>
            </div>
          </div>

          {/* Mobile close */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Navigation Groups ── */}
      <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-3 space-y-6 custom-scrollbar">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(isItemVisible);
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              {/* Group Label */}
              <div className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                {group.label}
              </div>

              {/* Nav Items */}
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`
                        w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-medium
                        transition-all duration-150 cursor-pointer group relative
                        ${
                          isActive
                            ? 'bg-white/[0.08] text-white shadow-sm font-semibold'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                        }
                      `}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        size={17}
                        className={`shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                        }`}
                      />
                      <div className="flex flex-col text-left min-w-0">
                        <span className="truncate leading-tight">{item.label}</span>
                        {item.description && (
                          <span className="text-[10px] text-zinc-500 font-normal truncate leading-tight group-hover:text-zinc-400">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block h-screen shrink-0">{sidebarContent}</aside>

      {/* Mobile overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};

export default PortalSidebar;
