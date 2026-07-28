import React from 'react';

export const GallerySkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse select-none p-2">
      <div className="h-6 w-40 rounded bg-zinc-900 border border-zinc-800" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-56 rounded-lg bg-zinc-900 border border-zinc-800" />
        ))}
      </div>
    </div>
  );
};

export default GallerySkeleton;
