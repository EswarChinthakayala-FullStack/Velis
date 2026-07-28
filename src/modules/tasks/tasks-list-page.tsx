import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from './hooks/useTasks';
import { useTaskFilters } from './hooks/useTaskFilters';
import { useUpdateTask, useBulkUpdateTasks } from './hooks/useUpdateTask';
import { useDeleteTask, useBulkDeleteTasks } from './hooks/useDeleteTask';

import type { TaskItem, TaskPriority, TaskStatus } from './lib/types/task';
import { TasksHeader } from './components/TasksHeader';
import { TaskKpiSummary } from './components/TaskKpiSummary';
import { TaskFilters } from './components/TaskFilters';
import { TaskTable } from './components/TaskTable';
import { BulkToolbar } from './components/BulkToolbar';
import { TaskEmptyState } from './components/TaskEmptyState';
import { TaskSkeleton } from './components/TaskSkeleton';
import { CreateTaskModal } from './components/CreateTaskModal';
import { TaskDetailDrawer } from './task-detail-drawer';
import { KanbanBoard } from '../kanban/kanban-board';

import { ConfirmDeleteDialog } from '../../components/ui/confirm-delete-dialog';

export interface TasksListPageProps {
  projectId?: string;
  className?: string;
}

export const TasksListPage: React.FC<TasksListPageProps> = ({ projectId, className = '' }) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);
  const [activeDetailTaskId, setActiveDetailTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [isConfirmBulkDeleteOpen, setIsConfirmBulkDeleteOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  // 1. Live Supabase Data Hook
  const { tasks, kpis, isLoading } = useTasks(projectId);

  // 2. Client Filter & Search Hook
  const {
    filters,
    setSearch,
    setProjectId,
    setModule,
    setPriority,
    setStatus,
    setDueDate,
    resetFilters,
    filteredTasks,
    availableModules,
  } = useTaskFilters(tasks);

  // 3. Mutations
  const updateMutation = useUpdateTask(projectId);
  const bulkUpdateMutation = useBulkUpdateTasks(projectId);
  const deleteMutation = useDeleteTask(projectId);
  const bulkDeleteMutation = useBulkDeleteTasks(projectId);

  // Keyboard Shortcuts: 'N' for New Task, '/' for Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (!isInput && (e.key === 'N' || e.key === 'n')) {
        e.preventDefault();
        setTaskToEdit(null);
        setIsModalOpen(true);
      } else if (!isInput && e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Inline Cell Edits
  const handleUpdateStatus = (id: string, status: TaskStatus) => {
    updateMutation.mutate({ id, payload: { status } });
  };

  const handleUpdatePriority = (id: string, priority: TaskPriority) => {
    updateMutation.mutate({ id, payload: { priority } });
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    const status: TaskStatus = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'todo';
    updateMutation.mutate({ id, payload: { progress, status } });
  };

  const handleUpdateDueDate = (id: string, dueDate: string) => {
    updateMutation.mutate({ id, payload: { dueDate } });
  };

  // Handlers for Bulk Operations
  const handleBulkMarkCompleted = () => {
    if (selectedTaskIds.length === 0) return;
    bulkUpdateMutation.mutate(
      { ids: selectedTaskIds, payload: { status: 'completed', progress: 100 } },
      { onSuccess: () => setSelectedTaskIds([]) }
    );
  };

  const handleBulkChangeStatus = (status: TaskStatus) => {
    if (selectedTaskIds.length === 0) return;
    bulkUpdateMutation.mutate(
      { ids: selectedTaskIds, payload: { status } },
      { onSuccess: () => setSelectedTaskIds([]) }
    );
  };

  const handleBulkChangePriority = (priority: TaskPriority) => {
    if (selectedTaskIds.length === 0) return;
    bulkUpdateMutation.mutate(
      { ids: selectedTaskIds, payload: { priority } },
      { onSuccess: () => setSelectedTaskIds([]) }
    );
  };

  const handleBulkDelete = () => {
    if (selectedTaskIds.length === 0) return;
    setIsConfirmBulkDeleteOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`space-y-6 text-zinc-100 font-mono ${className}`}
    >
      {/* 1. Header with View Toggle (Table vs Kanban Board) */}
      <TasksHeader
        totalTasks={kpis.total}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreateModal={() => {
          setTaskToEdit(null);
          setIsModalOpen(true);
        }}
      />

      {/* 2. KPI Summary Cards */}
      <TaskKpiSummary
        kpis={kpis}
        activeStatusFilter={filters.status}
        activeDueDateFilter={filters.dueDate}
        onSelectStatusFilter={setStatus}
        onSelectDueDateFilter={setDueDate}
      />

      {/* 3. Conditional View: TanStack Table View vs Kanban Board View */}
      {viewMode === 'kanban' ? (
        <KanbanBoard projectId={projectId} />
      ) : (
        <>
          {/* Search & Filter Bar */}
          <TaskFilters
            filters={filters}
            availableModules={availableModules}
            onSearchChange={setSearch}
            onProjectChange={setProjectId}
            onModuleChange={setModule}
            onPriorityChange={setPriority}
            onStatusChange={setStatus}
            onResetFilters={resetFilters}
          />

          {/* Table / Loading / Empty Viewport */}
          {isLoading ? (
            <TaskSkeleton />
          ) : filteredTasks.length === 0 ? (
            <TaskEmptyState
              isSearchFiltered={tasks.length > 0}
              onResetFilters={resetFilters}
              onOpenCreateModal={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
              }}
            />
          ) : (
            <TaskTable
              tasks={filteredTasks}
              selectedTaskIds={selectedTaskIds}
              onSelectionChange={setSelectedTaskIds}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePriority={handleUpdatePriority}
              onUpdateProgress={handleUpdateProgress}
              onUpdateDueDate={handleUpdateDueDate}
              onEditTask={(task) => {
                setActiveDetailTaskId(task.id);
              }}
              onDeleteTask={(id) => setTaskToDeleteId(id)}
            />
          )}

          {/* Floating Bulk Actions Toolbar */}
          <BulkToolbar
            selectedCount={selectedTaskIds.length}
            onMarkCompleted={handleBulkMarkCompleted}
            onChangeStatus={handleBulkChangeStatus}
            onChangePriority={handleBulkChangePriority}
            onDeleteSelected={handleBulkDelete}
            onClearSelection={() => setSelectedTaskIds([])}
          />
        </>
      )}

      {/* Modal Dialog for Create Task */}
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

      {/* Confirm Single Delete Task Dialog */}
      <ConfirmDeleteDialog
        isOpen={Boolean(taskToDeleteId)}
        onClose={() => setTaskToDeleteId(null)}
        onConfirm={async () => {
          if (taskToDeleteId) {
            await deleteMutation.mutateAsync(taskToDeleteId);
          }
        }}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        isLoading={deleteMutation.isPending}
      />

      {/* Confirm Bulk Delete Tasks Dialog */}
      <ConfirmDeleteDialog
        isOpen={isConfirmBulkDeleteOpen}
        onClose={() => setIsConfirmBulkDeleteOpen(false)}
        onConfirm={async () => {
          if (selectedTaskIds.length > 0) {
            await bulkDeleteMutation.mutateAsync(selectedTaskIds);
            setSelectedTaskIds([]);
          }
        }}
        title="Delete Selected Tasks"
        description={`Are you sure you want to delete ${selectedTaskIds.length} selected task(s)? This action cannot be undone.`}
        confirmText="Delete Selected"
        isLoading={bulkDeleteMutation.isPending}
      />
    </motion.div>
  );
};

export default TasksListPage;
