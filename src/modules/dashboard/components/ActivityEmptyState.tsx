import React from 'react';

export const ActivityEmptyState: React.FC = () => {
  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-3 select-none">
      <svg
        className="w-12 h-12 text-zinc-700 stroke-zinc-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-zinc-300">No recent activity</h4>
        <p className="text-[11px] text-zinc-500 max-w-xs">
          Activity logs will appear here automatically as you create projects, update milestones, and collaborate across your workspace.
        </p>
      </div>
    </div>
  );
};

export default ActivityEmptyState;
