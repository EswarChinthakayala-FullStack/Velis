import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon, ArrowRight01Icon, ViewIcon } from '@hugeicons/core-free-icons';

interface PortalHeaderProps {
  projectName?: string;
  status?: string;
  onOpenMobileSidebar?: () => void;
  activeTabTitle?: string;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  projectName = 'Client Portal',
  onOpenMobileSidebar,
  activeTabTitle = 'Overview',
}) => {
  return (
    <header className="shrink-0 z-40 w-full bg-[#0a0a0b]/95 backdrop-blur-xl border-b border-zinc-800/50 select-none">
      <div className="flex items-center justify-between h-12 px-4 sm:px-6">
        {/* Left: Hamburger + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile toggle */}
          {onOpenMobileSidebar && (
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-1.5 -ml-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
              aria-label="Open navigation"
            >
              <HugeiconsIcon icon={Menu01Icon} size={18} />
            </button>
          )}

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[13px] min-w-0" aria-label="Breadcrumb">
            <span className="text-zinc-500 font-medium truncate max-w-[160px] sm:max-w-[240px]">
              {projectName}
            </span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={11} className="text-zinc-700 shrink-0" />
            <span className="text-zinc-200 font-semibold truncate">
              {activeTabTitle}
            </span>
          </nav>
        </div>

        {/* Right: Status indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shrink-0" />
            <span className="font-medium hidden sm:inline">Live</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-zinc-400">
            <HugeiconsIcon icon={ViewIcon} size={12} className="text-zinc-500" />
            <span className="font-medium">View Only</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PortalHeader;
