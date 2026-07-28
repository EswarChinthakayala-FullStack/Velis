import React from 'react';

export const TimelineSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse font-mono">
      <div className="h-6 w-32 bg-zinc-900 rounded" />

      <div className="space-y-6 pl-4 border-l border-zinc-800">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-48 bg-zinc-800 rounded" />
              <div className="h-4 w-24 bg-zinc-800/60 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-zinc-800/40 rounded" />
              <div className="h-3 w-3/4 bg-zinc-800/40 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineSkeleton;
