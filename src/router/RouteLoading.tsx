import React from 'react';
import { AppLogo } from '../components/ui/AppLogo';

export const RouteLoading: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-rose-500/20 blur-xl animate-pulse" />
        <AppLogo size={48} animated />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        <p className="text-xs font-mono text-zinc-400 tracking-wider">
          Loading Module...
        </p>
      </div>
    </div>
  );
};

export default RouteLoading;
