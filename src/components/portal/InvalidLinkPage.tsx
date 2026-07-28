import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon } from '@hugeicons/core-free-icons';
import { AppLogo } from '../ui/AppLogo';

export const InvalidLinkPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-2xl text-center space-y-6 shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
            <HugeiconsIcon icon={AlertCircleIcon} size={24} />
          </div>
          <AppLogo size={36} showText={false} />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Invalid Share Link
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The share link token provided is invalid or has been deleted.
          </p>
        </div>

        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-500">
          Double check the URL or request a new share link from your agency representative.
        </div>
      </div>
    </div>
  );
};
