import React from 'react';

export const UploadSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse p-4 select-none">
      <div className="h-28 rounded-lg bg-zinc-900 border border-zinc-800 w-full" />
      <div className="h-12 rounded-lg bg-zinc-900 border border-zinc-800 w-full" />
      <div className="h-12 rounded-lg bg-zinc-900 border border-zinc-800 w-full" />
    </div>
  );
};

export default UploadSkeleton;
