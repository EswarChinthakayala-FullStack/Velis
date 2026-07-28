import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon } from '@hugeicons/core-free-icons';
import { Breadcrumbs } from './Breadcrumbs';
import { SearchTrigger } from './SearchTrigger';
import { ThemeToggle } from './ThemeToggle';
import { NotificationButton } from './NotificationButton';
import { QuickActions } from './QuickActions';
import { AvatarMenu } from './AvatarMenu';
import { useLayoutStore } from '../../../stores/useLayoutStore';

interface TopbarProps {
  onOpenCreateProject?: () => void;
  onOpenSearch?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenCreateProject,
  onOpenSearch,
}) => {
  const { toggleMobile } = useLayoutStore();

  return (
    <header className="h-[72px] bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl px-4 lg:px-6 flex items-center justify-between gap-4 select-none shrink-0">
      {/* Left Section: Mobile Menu Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobile}
          className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/80 transition-colors lg:hidden"
          aria-label="Open navigation menu"
        >
          <HugeiconsIcon icon={Menu01Icon} size={20} />
        </button>

        <Breadcrumbs />
      </div>

      {/* Center Section: Global Search Trigger */}
      <div className="flex-1 max-w-md hidden md:flex justify-center">
        <SearchTrigger onClick={onOpenSearch} />
      </div>

      {/* Right Section: Theme, Notifications, Actions, Avatar */}
      <div className="flex items-center gap-2.5">
        <ThemeToggle />
        <NotificationButton />
        <QuickActions onOpenCreateProject={onOpenCreateProject} />
        <AvatarMenu />
      </div>
    </header>
  );
};

export default Topbar;
