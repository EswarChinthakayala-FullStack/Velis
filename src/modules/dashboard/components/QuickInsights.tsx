import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuickInsights } from '../hooks/useQuickInsights';
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

export const QuickInsights: React.FC = () => {
  const navigate = useNavigate();
  const { data: insights, isLoading, isError, refetch } = useQuickInsights();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-zinc-900/60 rounded-lg border border-zinc-800/40" />
        ))}
      </div>
    );
  }

  if (isError || !insights) {
    return (
      <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-lg text-xs text-zinc-400 flex items-center justify-between">
        <span>Failed to load quick insights.</span>
        <button onClick={() => refetch()} className="px-2 py-1 bg-zinc-800 text-white rounded text-[11px]">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
      {insights.map((insight) => (
        <div
          key={insight.id}
          onClick={() => insight.actionRoute && navigate(insight.actionRoute)}
          className="p-4 bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl flex items-center justify-between gap-3 hover:border-zinc-700/80 hover:bg-zinc-900/40 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <HugeiconsIcon icon={SparklesIcon} size={16} className="text-zinc-300 animate-pulse" />
            </div>
            <p className="text-xs font-medium text-zinc-300 leading-snug">
              {insight.title}
            </p>
          </div>

          {insight.actionLabel && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (insight.actionRoute) navigate(insight.actionRoute);
              }}
              className="flex items-center gap-1 text-[11px] font-mono font-semibold text-zinc-400 group-hover:text-white transition-colors shrink-0 cursor-pointer"
            >
              <span>{insight.actionLabel}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuickInsights;
