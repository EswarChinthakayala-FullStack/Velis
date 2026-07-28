import React from 'react';

export const NotesSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 font-mono select-none">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 rounded-lg bg-[#0c0c0e]/80 border border-zinc-800/80 space-y-3 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="w-24 h-5 rounded bg-zinc-800" />
            <div className="w-16 h-5 rounded bg-zinc-800" />
          </div>
          <div className="w-2/3 h-5 rounded bg-zinc-800" />
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded bg-zinc-900" />
            <div className="w-5/6 h-3 rounded bg-zinc-900" />
            <div className="w-4/6 h-3 rounded bg-zinc-900" />
          </div>
        </div>
      ))}
    </div>
  );
};
