import React from 'react';

export const ProjectsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full animate-pulse select-none">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="h-60 p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/40 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-4 bg-zinc-800 rounded w-3/4" />
            <div className="h-4 bg-zinc-800/60 rounded w-1/4" />
          </div>
          <div className="h-8 bg-zinc-800/40 rounded-lg" />
          <div className="h-2 bg-zinc-800 rounded-full w-full" />
          <div className="h-6 bg-zinc-800/60 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
};

export default ProjectsSkeleton;
