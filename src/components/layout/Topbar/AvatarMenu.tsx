import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  User02Icon,
  Settings01Icon,
  CommandIcon,
  FileCodeIcon,
  Logout01Icon,
} from '@hugeicons/core-free-icons';
import { useAuth } from '../../../modules/auth/auth-hooks';

export const AvatarMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const userEmail = user?.email ?? 'admin@velis.studio';
  const userName = user?.user_metadata?.full_name ?? 'Eswar Chinthakayala';
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700/80 hover:border-zinc-500/80 flex items-center justify-center text-xs font-mono font-bold text-white transition-all cursor-pointer shadow-md shrink-0"
        aria-label="User profile menu"
      >
        {userInitials}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-[rgba(17,17,19,0.95)] border border-zinc-800/80 rounded-lg p-2 backdrop-blur-2xl shadow-2xl z-50 text-xs space-y-1">
            {/* Admin Profile Info Card */}
            <div className="p-2.5 border-b border-zinc-800/80 space-y-0.5">
              <span className="block font-semibold text-white truncate">{userName}</span>
              <span className="block text-[11px] text-zinc-400 font-mono truncate">{userEmail}</span>
            </div>

            {/* Menu Options */}
            <div className="pt-1 space-y-0.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/app/profile');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors text-left"
              >
                <HugeiconsIcon icon={User02Icon} size={15} className="text-zinc-400 shrink-0" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/app/settings');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors text-left"
              >
                <HugeiconsIcon icon={Settings01Icon} size={15} className="text-zinc-400 shrink-0" />
                <span>Preferences</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/app/docs');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors text-left"
              >
                <HugeiconsIcon icon={FileCodeIcon} size={15} className="text-zinc-400 shrink-0" />
                <span>Documentation</span>
              </button>
            </div>

            <div className="pt-1 border-t border-zinc-800/80">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-rose-500/10 hover:text-rose-400 text-zinc-400 transition-colors text-left font-medium"
              >
                <HugeiconsIcon icon={Logout01Icon} size={15} className="shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AvatarMenu;
