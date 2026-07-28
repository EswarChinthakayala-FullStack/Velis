import React from 'react';
import { DragOverlay } from '@dnd-kit/core';
import type { TaskItem } from '../../tasks/lib/types/task';
import { KanbanCard } from './KanbanCard';

interface KanbanDragOverlayProps {
  activeTask: TaskItem | null;
}

export const KanbanDragOverlay: React.FC<KanbanDragOverlayProps> = ({ activeTask }) => {
  return (
    <DragOverlay dropAnimation={null}>
      {activeTask ? (
        <div className="w-[280px]">
          <KanbanCard task={activeTask} onEditTask={() => {}} isOverlay />
        </div>
      ) : null}
    </DragOverlay>
  );
};

export default KanbanDragOverlay;
