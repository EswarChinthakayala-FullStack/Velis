import React from 'react';

export const ActivitySkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse select-none">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
          <div className="w-8 h-8 rounded-lg bg-zinc-800/80 shrink-0" />
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="w-48 h-3.5 bg-zinc-800/80 rounded" />
            <div className="w-32 h-3 bg-zinc-800/80 rounded" />
          </div>
          <div className="w-16 h-3 bg-zinc-800/80 rounded shrink-0" />
        </div>
      ))}
    </div>
  );
};

export default ActivitySkeleton;
