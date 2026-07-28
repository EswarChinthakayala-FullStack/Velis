import React from 'react';

export const FileSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse select-none p-2">
      {/* Folder Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-zinc-900 border border-zinc-800" />
        ))}
      </div>

      {/* File Cards Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="h-44 rounded-lg bg-zinc-900 border border-zinc-800" />
        ))}
      </div>
    </div>
  );
};

export default FileSkeleton;
