import React from 'react';

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="p-5 bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl space-y-4 animate-pulse h-64 select-none">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="w-36 h-4 bg-zinc-800/80 rounded" />
          <div className="w-48 h-3 bg-zinc-800/80 rounded" />
        </div>
        <div className="w-16 h-5 bg-zinc-800/80 rounded" />
      </div>
      <div className="h-40 bg-zinc-900/60 rounded-lg border border-zinc-800/40" />
    </div>
  );
};

export default ChartSkeleton;
