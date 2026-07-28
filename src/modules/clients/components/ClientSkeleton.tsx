import React from 'react';

export const ClientSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse select-none">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800/80" />
            <div className="space-y-1.5">
              <div className="w-36 h-4 bg-zinc-800/80 rounded" />
              <div className="w-48 h-3 bg-zinc-800/80 rounded" />
            </div>
          </div>
          <div className="w-24 h-4 bg-zinc-800/80 rounded hidden md:block" />
          <div className="w-16 h-4 bg-zinc-800/80 rounded hidden sm:block" />
          <div className="w-8 h-8 rounded-lg bg-zinc-800/80" />
        </div>
      ))}
    </div>
  );
};

export default ClientSkeleton;
