import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Mail01Icon, LockKeyIcon, ArrowRight01Icon, SecurityCheckIcon } from '@hugeicons/core-free-icons';
import { AppLogo } from '../ui/AppLogo';
import { AmbientBackground } from '../ui/AmbientBackground';
import { supabase } from '../../lib/supabase';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('eswarchinthakayala2004@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Attempt Supabase Auth login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        onLoginSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] flex items-center justify-center p-4 overflow-hidden select-none">
      <AmbientBackground />
      <div className="relative z-10 w-full max-w-md bg-[rgba(17,17,19,0.88)] border border-zinc-800/80 rounded-lg p-8 backdrop-blur-2xl shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <AppLogo size={48} showText={false} />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Velis Workspace Admin
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in to manage projects, clients, deliverables, and client portals.
          </p>
        </div>

        {/* Sole Admin System Banner */}
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
          <HugeiconsIcon icon={SecurityCheckIcon} size={16} className="shrink-0 mt-0.5 text-rose-400" />
          <div>
            <span className="font-semibold text-rose-200">Sole System Admin Access</span>
            <p className="text-[11px] text-rose-300/80 mt-0.5">
              Public signups are disabled. This workspace is managed exclusively by <strong>Eswar Chinthakayala</strong>.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">Admin Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <HugeiconsIcon icon={Mail01Icon} size={16} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eswarchinthakayala2004@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-zinc-900/90 border border-zinc-700/60 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <HugeiconsIcon icon={LockKeyIcon} size={16} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-zinc-900/90 border border-zinc-700/60 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 text-center">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl text-sm transition-all disabled:opacity-50 cursor-pointer shadow-lg mt-2"
          >
            {isLoading ? 'Authenticating Admin...' : 'Sign In as Admin'}
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-zinc-800/80">
          <p className="text-[11px] text-zinc-500 font-mono">
            Client Portal Access? Use your unique project share link.
          </p>
        </div>

      </div>
    </div>
  );
};
