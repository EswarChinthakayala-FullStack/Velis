import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { LockKeyIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { AppLogo } from '../ui/AppLogo';

interface PasswordDialogProps {
  onSubmit: (password: string) => void;
  error?: string | null;
  isLoading?: boolean;
}

export const PasswordDialog: React.FC<PasswordDialogProps> = ({
  onSubmit,
  error,
  isLoading
}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onSubmit(password);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <AppLogo size={44} showText={false} />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Protected Client Portal
          </h2>
          <p className="text-xs text-zinc-400">
            This project portal is password protected. Enter the access password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <HugeiconsIcon icon={LockKeyIcon} size={16} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter portal password"
              className="w-full pl-10 pr-4 py-3 bg-zinc-900/90 border border-zinc-700/60 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl text-sm transition-all disabled:opacity-50 cursor-pointer shadow-lg"
          >
            {isLoading ? 'Verifying...' : 'Unlock Portal'}
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
