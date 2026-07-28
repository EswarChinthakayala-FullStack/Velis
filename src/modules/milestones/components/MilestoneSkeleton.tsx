import React from 'react';

export const MilestoneSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse font-mono select-none">
      {[1, 2, 3].map((idx) => (
        <div key={idx} className="flex items-start gap-4">
          <div className="w-7 h-7 rounded-sm bg-zinc-800/80 shrink-0" />
          <div className="flex-1 p-4 rounded-sm bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-40 bg-zinc-800 rounded-sm" />
              <div className="h-4 w-20 bg-zinc-800 rounded-sm" />
            </div>
            <div className="h-2.5 w-full bg-zinc-800/80 rounded-sm" />
            <div className="h-3 w-1/3 bg-zinc-800/60 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MilestoneSkeleton;
