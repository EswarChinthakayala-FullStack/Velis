import React from 'react';

export const ProjectWorkspaceSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full animate-pulse select-none">
      <div className="h-20 bg-zinc-900/60 rounded-xl border border-zinc-800/40 p-5 space-y-2">
        <div className="h-6 bg-zinc-800 rounded w-1/3" />
        <div className="h-3 bg-zinc-800/60 rounded w-1/4" />
      </div>

      <div className="h-10 bg-zinc-900/40 rounded-lg w-full" />

      <div className="h-[600px] bg-zinc-900/40 border border-zinc-800/40 rounded-xl" />
    </div>
  );
};

export default ProjectWorkspaceSkeleton;
