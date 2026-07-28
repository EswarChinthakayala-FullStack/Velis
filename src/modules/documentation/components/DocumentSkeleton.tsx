import React from 'react';

export const DocumentSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse select-none p-4">
      {/* Sidebar Skeleton */}
      <div className="flex gap-6">
        <div className="w-64 h-96 rounded-lg bg-zinc-900/60 border border-zinc-800/80 p-4 space-y-3 hidden md:block">
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
          <div className="h-3 bg-zinc-800/60 rounded w-full" />
          <div className="h-3 bg-zinc-800/60 rounded w-5/6" />
          <div className="h-3 bg-zinc-800/60 rounded w-2/3" />
          <div className="h-4 bg-zinc-800 rounded w-1/2 pt-4" />
          <div className="h-3 bg-zinc-800/60 rounded w-full" />
          <div className="h-3 bg-zinc-800/60 rounded w-4/5" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-zinc-800 rounded w-1/2" />
          <div className="h-10 bg-zinc-900 rounded w-full" />
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-zinc-800/80 rounded w-full" />
            <div className="h-4 bg-zinc-800/80 rounded w-11/12" />
            <div className="h-4 bg-zinc-800/80 rounded w-4/5" />
          </div>
          <div className="h-32 bg-zinc-900/80 rounded-lg border border-zinc-800/80" />
        </div>
      </div>
    </div>
  );
};

export default DocumentSkeleton;
