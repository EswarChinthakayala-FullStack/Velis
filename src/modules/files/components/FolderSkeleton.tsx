import React from 'react';

export const FolderSkeleton: React.FC = () => {
  return (
    <div className="space-y-1 animate-pulse select-none p-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-7 rounded-md bg-zinc-900/80 border border-zinc-800/60 w-full" />
      ))}
    </div>
  );
};

export default FolderSkeleton;
