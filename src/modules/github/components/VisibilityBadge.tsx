import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { LockIcon, Globe02Icon } from '@hugeicons/core-free-icons';

interface VisibilityBadgeProps {
  visibility?: 'public' | 'private' | 'internal';
  className?: string;
}

export const VisibilityBadge: React.FC<VisibilityBadgeProps> = ({ visibility = 'private', className = '' }) => {
  const isPrivate = visibility === 'private' || visibility === 'internal';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md uppercase tracking-wider ${
        isPrivate
          ? 'bg-zinc-800/90 text-zinc-300 border border-zinc-700/60'
          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
      } ${className}`}
    >
      <HugeiconsIcon icon={isPrivate ? LockIcon : Globe02Icon} size={11} />
      <span>{visibility}</span>
    </span>
  );
};

export default VisibilityBadge;
