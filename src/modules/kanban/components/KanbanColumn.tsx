import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TaskItem, TaskStatus } from '../../tasks/lib/types/task';
import { getColumnConfig } from '../lib/utils/kanban-dnd';
import { KanbanColumnHeader } from './KanbanColumnHeader';
import { KanbanCard } from './KanbanCard';
import { KanbanEmptyState } from './KanbanEmptyState';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: TaskItem[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: TaskItem) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  onAddTask,
  onEditTask,
}) => {
  const config = getColumnConfig(status);
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full rounded-sm bg-[#0c0c0e]/80 border transition-colors ${
        isOver ? 'border-white/50 bg-zinc-900/60' : 'border-zinc-800/90'
      }`}
    >
      <KanbanColumnHeader
        config={config}
        count={tasks.length}
        onAddTask={() => onAddTask(status)}
      />

      <div className="flex-1 p-2 space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <KanbanEmptyState onAddTask={() => onAddTask(status)} />
          ) : (
            tasks.map((task) => (
              <KanbanCard key={task.id} task={task} onEditTask={onEditTask} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
