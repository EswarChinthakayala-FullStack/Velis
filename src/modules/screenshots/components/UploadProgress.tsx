import React from 'react';
import type { UploadTaskStatus } from '../lib/utils/upload-manager';

interface UploadProgressProps {
  progress: number;
  status: UploadTaskStatus;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-rose-500';
      case 'cancelled':
        return 'bg-amber-500';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
      <div
        className={`h-full transition-all duration-300 ${getStatusColor()}`}
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
    </div>
  );
};

export default UploadProgress;
