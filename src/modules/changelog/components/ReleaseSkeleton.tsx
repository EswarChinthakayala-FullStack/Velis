import React from 'react';

export const ReleaseSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 font-mono select-none">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 rounded-lg bg-[#0c0c0e]/60 border border-zinc-800/60 space-y-3 animate-pulse"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-6 rounded bg-zinc-800" />
              <div className="w-20 h-5 rounded bg-zinc-800/80" />
              <div className="w-24 h-4 rounded bg-zinc-800/60" />
            </div>
            <div className="w-6 h-6 rounded bg-zinc-800" />
          </div>
          <div className="w-2/3 h-5 rounded bg-zinc-800" />
          <div className="w-full h-12 rounded bg-zinc-900/60" />
        </div>
      ))}
    </div>
  );
};
