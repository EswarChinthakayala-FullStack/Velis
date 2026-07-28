import React from 'react';

export const TaskSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 font-mono">
      <div className="p-4 rounded-sm bg-zinc-950 border border-zinc-800 animate-pulse space-y-3">
        <div className="h-4 bg-zinc-900 rounded-sm w-1/4" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-zinc-900/60 rounded-sm flex items-center justify-between px-4">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-4 h-4 bg-zinc-800 rounded-sm" />
                <div className="h-3 bg-zinc-800 rounded-sm flex-1" />
              </div>
              <div className="h-3 bg-zinc-800 rounded-sm w-20" />
              <div className="h-3 bg-zinc-800 rounded-sm w-16" />
              <div className="h-3 bg-zinc-800 rounded-sm w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskSkeleton;
