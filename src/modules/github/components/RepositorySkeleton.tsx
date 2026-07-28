import React from 'react';

export const RepositorySkeleton: React.FC = () => {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-24 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />

      {/* KPI Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="h-64 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
          <div className="h-56 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
        </div>
        <div className="space-y-5">
          <div className="h-44 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
          <div className="h-40 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
        </div>
      </div>
    </div>
  );
};

export default RepositorySkeleton;
