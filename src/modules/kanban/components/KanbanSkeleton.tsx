import React from 'react';

export const KanbanSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 font-mono">
      {Array.from({ length: 5 }).map((_, colIdx) => (
        <div
          key={colIdx}
          className="rounded-sm bg-zinc-950/60 border border-zinc-800 p-3 space-y-3 animate-pulse"
        >
          <div className="h-5 bg-zinc-900 rounded-sm w-1/2" />
          <div className="space-y-2.5">
            {Array.from({ length: 3 }).map((_, cardIdx) => (
              <div key={cardIdx} className="h-24 bg-zinc-900/50 rounded-sm" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanSkeleton;
