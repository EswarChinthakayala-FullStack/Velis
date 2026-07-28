import React from 'react';

export const DeploymentSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 font-mono select-none">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-lg bg-[#0c0c0e]/80 border border-zinc-800/80 space-y-2 animate-pulse">
            <div className="w-16 h-3 rounded bg-zinc-800" />
            <div className="w-24 h-6 rounded bg-zinc-800" />
            <div className="w-20 h-3 rounded bg-zinc-900" />
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-[#0c0c0e]/80 border border-zinc-800/80 p-4 space-y-3 animate-pulse">
        <div className="w-full h-8 rounded bg-zinc-900" />
        <div className="w-full h-8 rounded bg-zinc-900" />
        <div className="w-full h-8 rounded bg-zinc-900" />
      </div>
    </div>
  );
};
