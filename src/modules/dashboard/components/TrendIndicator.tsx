import React from 'react';

interface TrendIndicatorProps {
  trend?: string;
  type?: 'positive' | 'negative' | 'neutral' | 'live';
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  trend = 'Live Data',
  type = 'live',
}) => {
  const getStyle = () => {
    switch (type) {
      case 'positive':
        return 'bg-zinc-800 text-zinc-200 border-zinc-700/80';
      case 'negative':
        return 'bg-zinc-900 text-zinc-400 border-zinc-800';
      default:
        return 'bg-zinc-800/90 text-zinc-300 border-zinc-700/60';
    }
  };

  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border ${getStyle()} shrink-0 flex items-center gap-1.5`}
    >
      {type === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
      <span>{trend}</span>
    </span>
  );
};

export default TrendIndicator;
