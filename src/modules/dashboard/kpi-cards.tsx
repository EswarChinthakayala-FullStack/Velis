import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KPICard } from './components/KPICard';
import { useAllDashboardKPIs } from './hooks/useAllDashboardKPIs';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

/**
 * KPICards Component (PHASE 05)
 * Executive KPI Summary Grid for Velis.
 * Orchestrates eight executive KPI cards powered by a single consolidated query to avoid network request flooding.
 */
export const KPICards: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useAllDashboardKPIs();

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full select-none"
      aria-label="Key Performance Indicators"
    >
      {/* Card 1: Active Projects */}
      <KPICard
        data={data?.activeProjects}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onClick={() => navigate('/app/projects')}
      />

      {/* Card 2: Completed Projects */}
      <KPICard
        data={data?.completedProjects}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onClick={() => navigate('/app/projects')}
      />

      {/* Card 3: On Hold Projects */}
      <KPICard
        data={data?.onHoldProjects}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onClick={() => navigate('/app/projects')}
      />

      {/* Card 4: Upcoming Deadlines */}
      <KPICard
        data={data?.upcomingDeadlines}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onClick={() => navigate('/app/milestones')}
      />

      {/* Card 5: Overdue Tasks */}
      <KPICard
        data={data?.overdueTasks}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onClick={() => navigate('/app/tasks')}
      />

      {/* Card 6: Active Clients */}
      <KPICard
        data={data?.activeClients}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onClick={() => navigate('/app/clients')}
      />

      {/* Card 7: Connected Repositories */}
      <KPICard
        data={data?.repositoryCount}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onClick={() => navigate('/app/github')}
      />

      {/* Card 8: Client Share Links */}
      <KPICard
        data={data?.activeShareLinks}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onClick={() => navigate('/app/share-links')}
      />
    </motion.section>
  );
};

export default KPICards;
