import React from 'react';
import type { BatchUploadTask } from '../lib/utils/upload-manager';
import { UploadCard } from './UploadCard';

interface UploadQueueProps {
  tasks: BatchUploadTask[];
  onCancel: (id: string) => void;
  onRetry: (task: BatchUploadTask) => void;
  onEditMetadata: (task: BatchUploadTask) => void;
}

export const UploadQueue: React.FC<UploadQueueProps> = ({
  tasks,
  onCancel,
  onRetry,
  onEditMetadata,
}) => {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
      {tasks.map((task) => (
        <UploadCard
          key={task.id}
          task={task}
          onCancel={onCancel}
          onRetry={onRetry}
          onEditMetadata={onEditMetadata}
        />
      ))}
    </div>
  );
};

export default UploadQueue;
