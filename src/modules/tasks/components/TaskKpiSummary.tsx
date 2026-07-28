import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Task01Icon,
  CircleIcon,
  Clock01Icon,
  Flag01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import type { TaskKpis, TaskStatus } from '../lib/types/task';

interface TaskKpiSummaryProps {
  kpis: TaskKpis;
  activeStatusFilter: 'all' | TaskStatus;
  activeDueDateFilter: string;
  onSelectStatusFilter: (status: 'all' | TaskStatus) => void;
  onSelectDueDateFilter: (dueDateFilter: 'all' | 'overdue') => void;
}

export const TaskKpiSummary: React.FC<TaskKpiSummaryProps> = ({
  kpis,
  activeStatusFilter,
  activeDueDateFilter,
  onSelectStatusFilter,
  onSelectDueDateFilter,
}) => {
  const CARDS = [
    {
      id: 'all',
      title: 'Total Tasks',
      count: kpis.total,
      icon: Task01Icon,
      color: 'text-zinc-300',
      active: activeStatusFilter === 'all' && activeDueDateFilter === 'all',
      onClick: () => {
        onSelectDueDateFilter('all');
        onSelectStatusFilter('all');
      },
    },
    {
      id: 'todo',
      title: 'Todo',
      count: kpis.todo,
      icon: CircleIcon,
      color: 'text-zinc-400',
      active: activeStatusFilter === 'todo',
      onClick: () => {
        onSelectDueDateFilter('all');
        onSelectStatusFilter('todo');
      },
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      count: kpis.inProgress,
      icon: Clock01Icon,
      color: 'text-amber-400',
      active: activeStatusFilter === 'in_progress',
      onClick: () => {
        onSelectDueDateFilter('all');
        onSelectStatusFilter('in_progress');
      },
    },
    {
      id: 'review',
      title: 'In Review',
      count: kpis.review,
      icon: Flag01Icon,
      color: 'text-purple-400',
      active: activeStatusFilter === 'review',
      onClick: () => {
        onSelectDueDateFilter('all');
        onSelectStatusFilter('review');
      },
    },
    {
      id: 'completed',
      title: 'Completed',
      count: kpis.completed,
      icon: CheckmarkCircle02Icon,
      color: 'text-emerald-400',
      active: activeStatusFilter === 'completed',
      onClick: () => {
        onSelectDueDateFilter('all');
        onSelectStatusFilter('completed');
      },
    },
    {
      id: 'overdue',
      title: 'Overdue',
      count: kpis.overdue,
      icon: AlertCircleIcon,
      color: 'text-rose-400',
      active: activeDueDateFilter === 'overdue',
      onClick: () => {
        onSelectStatusFilter('all');
        onSelectDueDateFilter('overdue');
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono select-none">
      {CARDS.map((card) => (
        <motion.button
          key={card.id}
          whileHover={{ y: -2 }}
          type="button"
          onClick={card.onClick}
          className={`p-3 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
            card.active
              ? 'bg-zinc-900 border-zinc-700 shadow-md ring-1 ring-zinc-700'
              : 'bg-[#0c0c0e]/80 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="truncate">{card.title}</span>
            <HugeiconsIcon icon={card.icon} size={14} className={card.color} />
          </div>
          <div className="text-xl font-bold text-white tracking-tight">{card.count}</div>
        </motion.button>
      ))}
    </div>
  );
};

export default TaskKpiSummary;
