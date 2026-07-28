import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';

interface KPIIconProps {
  icon: any;
}

export const KPIIcon: React.FC<KPIIconProps> = ({ icon }) => {
  return (
    <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800/80 text-white shadow-inner shrink-0 flex items-center justify-center">
      <HugeiconsIcon icon={icon} size={20} className="text-zinc-200" />
    </div>
  );
};

export default KPIIcon;
