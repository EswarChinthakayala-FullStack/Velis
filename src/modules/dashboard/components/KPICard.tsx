import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { KPIIcon } from './KPIIcon';
import { TrendIndicator } from './TrendIndicator';
import { KPICardSkeleton } from './KPICardSkeleton';
import type { KPICardProps } from '../types';
import { HugeiconsIcon } from '@hugeicons/react';
import { RefreshIcon } from '@hugeicons/core-free-icons';

export const KPICard: React.FC<KPICardProps> = React.memo(({
  data,
  isLoading,
  isError,
  onRetry,
  onClick,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Number count-up animation when value changes
  useEffect(() => {
    if (data?.value === undefined) return;
    const target = data.value;
    const duration = 600; // ms
    const steps = 20;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const currentVal = Math.round(target * Math.sin((progress * Math.PI) / 2));
      setDisplayValue(currentVal);

      if (currentStep >= steps) {
        setDisplayValue(target);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [data?.value]);

  if (isLoading) {
    return <KPICardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-5 bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-3 select-none">
        <span className="text-xs text-zinc-400 font-mono">Unable to load KPI metric.</span>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer w-fit"
        >
          <HugeiconsIcon icon={RefreshIcon} size={14} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={onClick}
      className={`p-5 bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-4 hover:border-zinc-700/90 transition-all select-none group ${
        onClick ? 'cursor-pointer' : ''
      }`}
      role="region"
      aria-label={`${data.title}: ${data.value}`}
    >
      {/* Top Row: Mini Glass Icon + Trend Indicator */}
      <div className="flex items-center justify-between">
        <KPIIcon icon={data.icon} />
        <TrendIndicator trend={data.trend} type={data.trendType} />
      </div>

      {/* Center Row: Animated Count-up Metric & Title */}
      <div className="space-y-1">
        <span className="text-3xl font-extrabold text-white tracking-tight font-sans block group-hover:text-zinc-100 transition-colors">
          {displayValue}
        </span>
        <h3 className="text-xs font-semibold text-zinc-300 tracking-tight group-hover:text-white transition-colors">
          {data.title}
        </h3>
      </div>

      {/* Bottom Row: Detail Label & Timestamp */}
      <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors">
        <span className="truncate">{data.label}</span>
        {data.updatedAt && <span className="shrink-0">{data.updatedAt}</span>}
      </div>
    </motion.div>
  );
});

KPICard.displayName = 'KPICard';

export default KPICard;
