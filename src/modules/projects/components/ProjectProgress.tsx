import React from 'react';

interface ProjectProgressProps {
  percent: number;
}

export const ProjectProgress: React.FC<ProjectProgressProps> = ({ percent }) => {
  const normalized = Math.min(100, Math.max(0, percent));

  return (
    <div className="space-y-1.5 select-none">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-zinc-400 font-medium">Completion Progress</span>
        <span className="text-white font-bold">{normalized}%</span>
      </div>

      <div className="h-2 w-full rounded-full bg-zinc-900 border border-zinc-800/80 overflow-hidden">
        <div
          className="h-full rounded-full bg-white transition-all duration-500 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  );
};

export default ProjectProgress;
