import React from 'react';

export const MilestoneFormSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-4 animate-pulse font-mono select-none">
      <div className="h-5 w-48 bg-zinc-800 rounded-sm" />
      <div className="h-9 w-full bg-zinc-900 border border-zinc-800 rounded-sm" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-9 bg-zinc-900 border border-zinc-800 rounded-sm" />
        <div className="h-9 bg-zinc-900 border border-zinc-800 rounded-sm" />
      </div>
      <div className="h-24 bg-zinc-900 border border-zinc-800 rounded-sm" />
    </div>
  );
};

export default MilestoneFormSkeleton;
