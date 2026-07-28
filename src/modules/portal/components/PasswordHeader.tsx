import React from 'react';
import { AppLogo } from '../../../components/ui/AppLogo';
import { HugeiconsIcon } from '@hugeicons/react';
import { LockKeyIcon } from '@hugeicons/core-free-icons';

interface PasswordHeaderProps {
  projectName?: string | null;
}

export const PasswordHeader: React.FC<PasswordHeaderProps> = ({ projectName }) => {
  return (
    <div className="flex flex-col items-center text-center space-y-3 select-none">
      <AppLogo size={44} showText={false} />

      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-amber-400 uppercase font-medium">
        <HugeiconsIcon icon={LockKeyIcon} size={12} />
        <span>Protected Portal</span>
      </span>

      <div className="space-y-1">
        <h2 className="text-base font-bold text-white font-sans tracking-tight">
          {projectName || 'Protected Project Portal'}
        </h2>
        <p className="text-xs text-zinc-400 font-sans max-w-xs leading-relaxed">
          This project is protected by a password. Enter the password provided by the project owner.
        </p>
      </div>
    </div>
  );
};
