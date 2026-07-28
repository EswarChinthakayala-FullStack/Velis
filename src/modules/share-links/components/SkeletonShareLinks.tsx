import React from 'react';

export const SkeletonShareLinks: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60 h-20 flex flex-col justify-between">
            <div className="w-16 h-3 bg-zinc-800 rounded" />
            <div className="w-10 h-6 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-zinc-800/80 bg-[#0c0c0e]/80 p-4 space-y-3">
        <div className="h-8 bg-zinc-900/80 rounded w-full mb-4" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-zinc-900/50 rounded w-full" />
        ))}
      </div>
    </div>
  );
};
