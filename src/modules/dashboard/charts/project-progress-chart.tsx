import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChartCard } from '../components/ChartCard';
import { ChartSkeleton } from '../components/ChartSkeleton';
import { ChartEmptyState } from '../components/ChartEmptyState';
import { ChartErrorState } from '../components/ChartErrorState';
import { useProjectProgressChart } from '../hooks/useProjectProgressChart';

export const ProjectProgressChart: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useProjectProgressChart();

  if (isLoading) return <ChartSkeleton />;

  if (isError) {
    return (
      <ChartCard title="Active Projects Progress" description="Live completion percentages">
        <ChartErrorState message="Failed to load project progress data." onRetry={() => refetch()} />
      </ChartCard>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartCard title="Active Projects Progress" description="Live completion percentages">
        <ChartEmptyState
          title="No active projects currently in progress"
          description="Create your first active project to start tracking live progress analytics."
        />
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Active Projects Progress"
      description="Live completion percentages"
      badge={`${data.length} Active`}
      onRefresh={() => refetch()}
    >
      <div className="space-y-2 pt-1 max-h-52 overflow-y-auto pr-1 select-none">
        {data.map((proj) => (
          <div
            key={proj.id}
            onClick={() => navigate(`/app/projects/${proj.id}`)}
            className="space-y-1.5 cursor-pointer p-2 rounded-lg hover:bg-zinc-900/60 transition-colors border border-transparent hover:border-zinc-800"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-white truncate max-w-[200px]">
                {proj.name}
              </span>
              <span className="text-zinc-300 font-bold shrink-0">
                {proj.completionPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-zinc-900 border border-zinc-800/80 overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${proj.completionPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: proj.color || '#FAFAFA' }}
              />
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

export default ProjectProgressChart;
