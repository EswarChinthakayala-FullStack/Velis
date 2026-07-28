import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SecurityCheckIcon } from '@hugeicons/core-free-icons';
import { AppLogo } from '../ui/AppLogo';

export const AccessRevokedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-2xl text-center space-y-6 shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <HugeiconsIcon icon={SecurityCheckIcon} size={24} />
          </div>
          <AppLogo size={36} showText={false} />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Access Revoked
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Access to this client portal share link has been revoked by the workspace administrator.
          </p>
        </div>

        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-500">
          If you believe this is an error, please reach out to your project administrator.
        </div>
      </div>
    </div>
  );
};
