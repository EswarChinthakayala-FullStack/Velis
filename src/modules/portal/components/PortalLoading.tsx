import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { SecurityCheckIcon } from '@hugeicons/core-free-icons';
import { AppLogo } from '../../../components/ui/AppLogo';
import { AuthBackground } from '../../auth/components/AuthBackground';
import { RadialSpinner } from '../../projects/components/RadialSpinner';

export const PortalLoading: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-4 overflow-hidden select-none font-sans">
      {/* Architectural Dark Monochrome Background */}
      <AuthBackground />

      {/* Floating Liquid Glass Loading Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm bg-[#0c0c0e]/95 border border-zinc-800/90 rounded-lg p-8 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center space-y-5"
      >
        {/* Animated App Logo with Radial Glow */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-rose-500/15 blur-xl animate-pulse" />
          <AppLogo size={52} showText={false} animated />
        </div>

        {/* Workspace Title & Brand */}
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white tracking-tight font-sans">
            Velis Workspace
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Enterprise Route Security
          </p>
        </div>

        {/* Loading Spinner & Status Text */}
        <div className="flex items-center justify-center gap-2.5 pt-2 text-zinc-300">
          <RadialSpinner size={18} className="text-[#FAFAFA] shrink-0" />
          <span className="text-xs font-medium text-zinc-300 font-mono">
            Loading Client Portal...
          </span>
        </div>

        {/* Security Assurance Badge */}
        <div className="pt-3 border-t border-zinc-800/80 w-full flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-mono">
          <HugeiconsIcon icon={SecurityCheckIcon} size={14} className="text-zinc-500 shrink-0" />
          <span>Supabase Auth Protected</span>
        </div>
      </motion.div>
    </div>
  );
};

export default PortalLoading;
