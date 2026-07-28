import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { DashboardCircleIcon } from '@hugeicons/core-free-icons';

interface ProjectCompletionCardProps {
  completionPercent: number;
}

export const ProjectCompletionCard: React.FC<ProjectCompletionCardProps> = ({
  completionPercent = 0,
}) => {
  const percent = Math.min(100, Math.max(0, completionPercent));
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-xl backdrop-blur-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs uppercase tracking-wider font-mono">
          <HugeiconsIcon icon={DashboardCircleIcon} size={15} className="text-zinc-400" />
          <span>Project Completion</span>
        </div>

        <span className="text-xs font-mono font-bold text-white">{percent}%</span>
      </div>

      {/* Progress Ring & Bar */}
      <div className="flex items-center gap-6 py-2">
        {/* Animated SVG Ring */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="text-zinc-800/80"
              strokeWidth="7"
              stroke="currentColor"
              fill="transparent"
            />
            <motion.circle
              cx="48"
              cy="48"
              r={radius}
              className="text-white"
              strokeWidth="7"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center font-mono">
            <span className="text-lg font-bold text-white tracking-tight">{percent}%</span>
          </div>
        </div>

        {/* Progress Bar & Details */}
        <div className="flex-1 space-y-3 min-w-0">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Overall Progress</span>
              <span>{percent} / 100</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-zinc-950/80 border border-zinc-800/80 overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-white shadow-sm"
              />
            </div>
          </div>

          <p className="text-[11px] font-mono text-zinc-500 italic">
            Calculated from completed tasks & milestones on Supabase.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCompletionCard;
