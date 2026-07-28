import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Tick02Icon,
  AlertCircleIcon,
  GitBranchIcon,
} from '@hugeicons/core-free-icons';
import { RadialSpinner } from '../../projects/components/RadialSpinner';
import type { ConnectionStatusState } from '../lib/github/types';

interface ConnectionStatusProps {
  status: ConnectionStatusState;
  errorMessage?: string | null;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status, errorMessage }) => {
  if (status === 'connected') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-mono font-semibold shrink-0"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <HugeiconsIcon icon={Tick02Icon} size={13} />
        <span>Connected</span>
      </motion.div>
    );
  }

  if (status === 'validating') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-mono font-semibold shrink-0"
      >
        <RadialSpinner size={12} className="text-amber-400" />
        <span>Validating...</span>
      </motion.div>
    );
  }

  if (status === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[11px] font-mono font-semibold shrink-0"
      >
        <HugeiconsIcon icon={AlertCircleIcon} size={13} />
        <span>{errorMessage || 'Connection Error'}</span>
      </motion.div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono font-medium shrink-0">
      <HugeiconsIcon icon={GitBranchIcon} size={13} className="text-zinc-500" />
      <span>Not Connected</span>
    </div>
  );
};

export default ConnectionStatus;
