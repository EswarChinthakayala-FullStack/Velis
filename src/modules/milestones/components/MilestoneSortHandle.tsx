import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { DragDropVerticalIcon } from '@hugeicons/core-free-icons';

interface MilestoneSortHandleProps {
  attributes?: Record<string, any>;
  listeners?: Record<string, any>;
  className?: string;
}

export const MilestoneSortHandle: React.FC<MilestoneSortHandleProps> = ({
  attributes,
  listeners,
  className = '',
}) => {
  return (
    <div
      {...attributes}
      {...listeners}
      className={`p-1.5 rounded-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors cursor-grab active:cursor-grabbing select-none font-mono ${className}`}
      title="Drag to reorder roadmap position"
    >
      <HugeiconsIcon icon={DragDropVerticalIcon} size={16} />
    </div>
  );
};

export default MilestoneSortHandle;
