import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Notification01Icon, SecurityCheckIcon } from '@hugeicons/core-free-icons';

export const NotificationButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = 3;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700/80 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-sm relative group"
        aria-label="View notifications"
      >
        <HugeiconsIcon
          icon={Notification01Icon}
          size={18}
          className="transition-transform duration-200 group-hover:scale-110"
        />

        {/* Monochrome Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white ring-2 ring-zinc-950 animate-pulse" />
        )}
      </button>

      {/* Notifications Glass Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-[rgba(17,17,19,0.95)] border border-zinc-800/80 rounded-lg p-4 backdrop-blur-2xl shadow-2xl z-50 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="font-bold text-white tracking-tight">Notifications</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                {unreadCount} unread
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/60 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <HugeiconsIcon icon={SecurityCheckIcon} size={14} className="text-zinc-400 shrink-0" />
                  <span>Supabase Auth Active</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Administrator session authenticated successfully.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/60 space-y-1">
                <span className="text-xs font-semibold text-white">GitHub Webhook Synced</span>
                <p className="text-[11px] text-zinc-400">
                  Latest commit on main branch processed.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationButton;
