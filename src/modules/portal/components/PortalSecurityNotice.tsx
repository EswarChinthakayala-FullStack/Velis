import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShieldKeyIcon } from '@hugeicons/core-free-icons';

export const PortalSecurityNotice: React.FC = () => {
  return (
    <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono select-none">
      <HugeiconsIcon icon={ShieldKeyIcon} size={13} className="text-zinc-600 shrink-0" />
      <span>This portal is read-only. No account required.</span>
    </div>
  );
};
