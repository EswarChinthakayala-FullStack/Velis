import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskItem } from '../tasks/lib/types/task';
import { TaskPriorityBadge } from '../tasks/components/TaskPriorityBadge';
import { TaskProgressSlider } from '../tasks/components/TaskProgressSlider';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar01Icon, File01Icon, AttachmentIcon } from '@hugeicons/core-free-icons';

export interface TaskCardProps {
  task: TaskItem;
  onClickCard?: (taskId: string) => void;
  onEditTask?: (task: TaskItem) => void;
  isOverlay?: boolean;
}

function stripMarkdown(text?: string): string {
  if (!text) return '';
  return text
    .replace(/\[TYPE:[^\]]+\]\s*/g, '')
    .replace(/[#*`_~>[\]()]/g, '')
    .trim();
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClickCard,
  onEditTask,
  isOverlay = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    if (onEditTask) onEditTask(task);
    if (onClickCard) onClickCard(task.id);
  };

  const plainDesc = stripMarkdown(task.description);
  const attachmentCount = task.attachments?.length || 0;
  const visibleLabels = task.labels.slice(0, 2);
  const overflowLabelCount = Math.max(0, task.labels.length - 2);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`p-3 rounded-sm bg-[#0c0c0e]/90 border border-zinc-800/90 shadow-md font-mono select-none space-y-2.5 transition-all cursor-grab active:cursor-grabbing hover:border-zinc-700 hover:bg-zinc-900/60 ${
        isDragging ? 'opacity-30 border-dashed border-zinc-600' : ''
      } ${isOverlay ? 'shadow-2xl border-white/40 ring-1 ring-white/20' : ''}`}
    >
      {/* 1. Top Header: Project Name & Module Tag */}
      <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-400">
        <span className="truncate font-semibold text-zinc-300">
          {task.projectName || 'Unassigned'}
        </span>
        {task.module && (
          <span className="px-1.5 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
            {task.module}
          </span>
        )}
      </div>

      {/* 2. Task Title & Description Preview */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{task.title}</h4>
        {plainDesc && (
          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
            <HugeiconsIcon icon={File01Icon} size={11} className="shrink-0" />
            <span className="truncate">{plainDesc}</span>
          </div>
        )}
      </div>

      {/* 3. Progress Slider */}
      <TaskProgressSlider progress={task.progress} disabled />

      {/* 4. Labels & Indicators */}
      {(visibleLabels.length > 0 || attachmentCount > 0) && (
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <div className="flex items-center gap-1 flex-wrap">
            {visibleLabels.map((l) => (
              <span
                key={l}
                className="px-1.5 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono"
              >
                #{l}
              </span>
            ))}
            {overflowLabelCount > 0 && (
              <span className="px-1 py-0.5 rounded-sm bg-zinc-900 text-zinc-500 font-mono text-[9px]">
                +{overflowLabelCount}
              </span>
            )}
          </div>

          {attachmentCount > 0 && (
            <div className="flex items-center gap-1 text-zinc-400 shrink-0" title={`${attachmentCount} attachment(s)`}>
              <HugeiconsIcon icon={AttachmentIcon} size={12} />
              <span>{attachmentCount}</span>
            </div>
          )}
        </div>
      )}

      {/* 5. Bottom Footer: Priority & Due Date */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/60 text-[10px]">
        <TaskPriorityBadge priority={task.priority} disabled />

        {task.dueDate && (
          <div className="flex items-center gap-1 text-zinc-400" title={`Due: ${task.dueDate}`}>
            <HugeiconsIcon icon={Calendar01Icon} size={11} />
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
