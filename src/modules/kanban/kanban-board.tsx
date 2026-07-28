import React, { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';

import type { TaskItem, TaskStatus } from '../tasks/lib/types/task';
import { useKanbanTasks } from './hooks/useKanbanTasks';
import { useMoveTask } from './hooks/useMoveTask';
import { useTaskFilters } from '../tasks/hooks/useTaskFilters';
import { KANBAN_COLUMNS } from './lib/utils/kanban-dnd';

import { KanbanHeader } from './components/KanbanHeader';
import { KanbanFilters } from './components/KanbanFilters';
import { KanbanColumn } from './components/KanbanColumn';
import { KanbanDragOverlay } from './components/KanbanDragOverlay';
import { KanbanSkeleton } from './components/KanbanSkeleton';
import { CreateTaskModal } from '../tasks/components/CreateTaskModal';
import { TaskDetailDrawer } from '../tasks/task-detail-drawer';

interface KanbanBoardProps {
  projectId?: string;
  className?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, className = '' }) => {
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);
  const [activeDetailTaskId, setActiveDetailTaskId] = useState<string | null>(null);
  const [presetStatus, setPresetStatus] = useState<TaskStatus>('todo');

  // 1. Live Supabase Data Hook
  const { tasks, groupedTasks, isLoading } = useKanbanTasks(projectId);

  // 2. Client Filters Hook
  const {
    filters,
    setSearch,
    setProjectId,
    setModule,
    setPriority,
    resetFilters,
    filteredTasks,
    availableModules,
  } = useTaskFilters(tasks);

  // 3. Move Task Mutation Hook
  const moveTaskMutation = useMoveTask(projectId);

  // dnd-kit sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter tasks per column
  const getFilteredColumnTasks = (status: TaskStatus): TaskItem[] => {
    const columnTasks = groupedTasks[status] || [];
    if (!filters.search && filters.projectId === 'all' && filters.module === 'all' && filters.priority === 'all') {
      return columnTasks;
    }
    const filteredSet = new Set(filteredTasks.map((t) => t.id));
    return columnTasks.filter((t) => filteredSet.has(t.id));
  };

  // Drag Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const task = tasks.find((t) => t.id === activeId);
    if (!task) return;

    let targetStatus: TaskStatus = task.status;

    const columnMatch = KANBAN_COLUMNS.find((c) => c.id === overId);
    if (columnMatch) {
      targetStatus = columnMatch.id;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    const targetColumnTasks = getFilteredColumnTasks(targetStatus);
    const targetIndex = targetColumnTasks.findIndex((t) => t.id === overId);
    const calculatedSortOrder = targetIndex >= 0 ? targetIndex : targetColumnTasks.length;

    if (task.status !== targetStatus || task.sortOrder !== calculatedSortOrder) {
      moveTaskMutation.mutate({
        taskId: activeId,
        targetStatus,
        targetSortOrder: calculatedSortOrder,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`space-y-5 text-zinc-100 font-mono ${className}`}
    >
      {/* Header */}
      <KanbanHeader
        totalTasks={tasks.length}
        onOpenCreateModal={() => {
          setTaskToEdit(null);
          setPresetStatus('todo');
          setIsModalOpen(true);
        }}
      />

      {/* Filter Bar */}
      <KanbanFilters
        filters={filters}
        availableModules={availableModules}
        onSearchChange={setSearch}
        onProjectChange={setProjectId}
        onModuleChange={setModule}
        onPriorityChange={setPriority}
        onResetFilters={resetFilters}
      />

      {/* Board Viewport */}
      {isLoading ? (
        <KanbanSkeleton />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 min-h-[550px] items-start">
            {KANBAN_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                status={column.id}
                tasks={getFilteredColumnTasks(column.id)}
                onAddTask={(status) => {
                  setTaskToEdit(null);
                  setPresetStatus(status);
                  setIsModalOpen(true);
                }}
                onEditTask={(task) => {
                  setActiveDetailTaskId(task.id);
                }}
              />
            ))}
          </div>

          <KanbanDragOverlay activeTask={activeTask} />
        </DndContext>
      )}

      {/* Create / Edit Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        defaultProjectId={projectId}
      />

      {/* Enterprise Task Detail Drawer */}
      <TaskDetailDrawer
        taskId={activeDetailTaskId}
        isOpen={Boolean(activeDetailTaskId)}
        onClose={() => setActiveDetailTaskId(null)}
        projectId={projectId}
      />
    </motion.div>
  );
};

export default KanbanBoard;
