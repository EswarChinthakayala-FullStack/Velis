import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardHeader } from './components/DashboardHeader';
import { QuickInsights } from './components/QuickInsights';
import { ChartsGrid } from './components/ChartsGrid';
import { RecentActivity } from './components/RecentActivity';
import { KPICards } from './kpi-cards';

/**
 * DashboardPage Component (PHASE 05)
 * Enterprise Project Operations Center Composition Layer for Velis.
 * 
 * Orchestrates reusable, independently-fetched dashboard widgets.
 * Driven strictly by Supabase queries via React Query v5.
 */
export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleRefreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-active-projects'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-completed-projects'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-on-hold-projects'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-upcoming-deadlines'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-overdue-tasks'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-active-clients'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-repository-count'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-active-share-links'] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="w-full max-w-[1600px] mx-auto space-y-6 text-zinc-100"
    >
      {/* 1. Dashboard Header */}
      <DashboardHeader
        onRefreshAll={handleRefreshAll}
        onOpenSearch={() => navigate('/app/projects')}
        onNewProject={() => navigate('/app/projects')}
      />

      {/* 2. Quick System Insights Bar */}
      <QuickInsights />

      {/* 4. 2x2 Charts Grid (Status Donut, Revenue Bar, Growth Area, GitHub Line) */}
      <ChartsGrid />

      {/* 5. Recent Activity Timeline Stream */}
      <RecentActivity />
    </motion.div>
  );
};

export default DashboardPage;
