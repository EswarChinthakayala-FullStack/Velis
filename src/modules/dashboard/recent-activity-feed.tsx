import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ActivityIcon as ActivityHeaderIcon, RefreshIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { useRecentActivity } from './hooks/useRecentActivity';
import { ActivityItem } from './components/ActivityItem';
import { ActivitySkeleton } from './components/ActivitySkeleton';
import { ActivityEmptyState } from './components/ActivityEmptyState';
import { ActivityErrorState } from './components/ActivityErrorState';

/**
 * RecentActivityFeed Component (PHASE 05)
 * Enterprise Operational Activity Stream for Velis.
 * 
 * Displays the 20 most recent activity records from Supabase (`activity_logs`).
 * Strictly production-only: ZERO mock data or fabricated history.
 */
export const RecentActivityFeed: React.FC = () => {
  const navigate = useNavigate();
  const { data: activities, isLoading, isError, refetch } = useRecentActivity();

  const handleSelectEntity = (entityType: string, _entityId?: string) => {
    switch (entityType?.toLowerCase()) {
      case 'project':
        navigate('/app/projects');
        break;
      case 'github':
      case 'commit':
      case 'repo':
        navigate('/app/github');
        break;
      case 'file':
        navigate('/app/files');
        break;
      case 'milestone':
        navigate('/app/timeline');
        break;
      case 'client':
        navigate('/app/clients');
        break;
      default:
        navigate('/app/dashboard');
        break;
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="p-5 bg-[rgba(17,17,19,0.85)] border border-zinc-800/80 rounded-lg backdrop-blur-2xl shadow-xl space-y-4 w-full select-none"
      aria-label="Recent Operational Activity Stream"
    >
      {/* Feed Header */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-zinc-800/60">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={ActivityHeaderIcon} size={18} className="text-white shrink-0" />
            <h3 className="text-sm font-bold text-white tracking-tight">Recent Activity</h3>
          </div>
          <p className="text-xs text-zinc-400 font-mono">Latest updates across your workspace.</p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => refetch()}
            className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-sm"
            title="Refresh Activity Stream"
            aria-label="Refresh Activity Stream"
          >
            <HugeiconsIcon icon={RefreshIcon} size={14} />
          </button>

          <button
            onClick={() => navigate('/app/timeline')}
            className="hidden sm:flex items-center gap-1 text-xs font-mono font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer px-2 py-1"
          >
            <span>View All</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && <ActivitySkeleton />}

      {/* Error Fallback */}
      {isError && <ActivityErrorState onRetry={() => refetch()} />}

      {/* Empty State */}
      {!isLoading && !isError && (!activities || activities.length === 0) && (
        <ActivityEmptyState />
      )}

      {/* Live Activity List Container (Max-height 600px with custom scroll) */}
      {!isLoading && !isError && activities && activities.length > 0 && (
        <div className="max-h-[600px] overflow-y-auto space-y-2 pr-1 custom-scrollbar scroll-smooth">
          {activities.map((item) => (
            <ActivityItem key={item.id} item={item} onSelectEntity={handleSelectEntity} />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default RecentActivityFeed;
