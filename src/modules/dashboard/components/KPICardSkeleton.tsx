import React from 'react';

export const KPICardSkeleton: React.FC = () => {
  return (
    <div className="p-5 bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-lg bg-zinc-800/80" />
        <div className="w-16 h-4 rounded bg-zinc-800/80" />
      </div>
      <div className="space-y-2">
        <div className="w-20 h-8 rounded bg-zinc-800/80" />
        <div className="w-32 h-3 rounded bg-zinc-800/80" />
      </div>
      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
        <div className="w-24 h-3 rounded bg-zinc-800/80" />
        <div className="w-12 h-3 rounded bg-zinc-800/80" />
      </div>
    </div>
  );
};

export default KPICardSkeleton;
