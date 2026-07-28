import React from 'react';
import { AppLogo } from '../../../components/ui/AppLogo';

export const PortalFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-800/40 bg-[#080809] py-4 px-4 sm:px-6 lg:px-8 select-none">
      <div className="flex items-center justify-between text-[11px] text-zinc-600">
        <div className="flex items-center gap-2">
          <AppLogo size={16} showText={false} />
          <span className="font-medium text-zinc-500">Velis</span>
        </div>
        <span>Secure Client Portal</span>
      </div>
    </footer>
  );
};
