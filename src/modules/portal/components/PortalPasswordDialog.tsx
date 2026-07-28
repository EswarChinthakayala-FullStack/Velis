import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { LockKeyIcon, ViewIcon, ViewOffIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { AppLogo } from '../../../components/ui/AppLogo';
import { motion } from 'framer-motion';

interface PortalPasswordDialogProps {
  onSubmit: (password: string) => void;
  error?: string | null;
  isLoading?: boolean;
}

export const PortalPasswordDialog: React.FC<PortalPasswordDialogProps> = ({
  onSubmit,
  error,
  isLoading = false,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isLoading) return;
    onSubmit(password.trim());
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="max-w-md w-full bg-[#0c0c0e]/95 border border-zinc-800 rounded-2xl p-8 backdrop-blur-2xl shadow-2xl space-y-6 text-left"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <AppLogo size={44} showText={false} />
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400">
            <HugeiconsIcon icon={LockKeyIcon} size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Password Protected Portal</h2>
            <p className="text-xs text-zinc-400 font-sans">Enter the access password to view this client portal</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400">Access Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-zinc-600 placeholder:text-zinc-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} size={15} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!password.trim() || isLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-sans font-medium text-xs hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying...' : 'Unlock Portal'}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
