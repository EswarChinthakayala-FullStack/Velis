import React from 'react';
import { ProjectProgressChart } from '../charts/project-progress-chart';
import { MonthlyCompletedChart } from '../charts/monthly-completed-chart';
import { TechnologyUsageChart } from '../charts/technology-usage-chart';
import { ClientDistributionChart } from '../charts/client-distribution-chart';

/**
 * ChartsGrid Component (PHASE 05)
 * 2x2 Responsive Chart Grid powered strictly by live Supabase queries via React Query v5.
 * Zero mock data, zero placeholder arrays, zero hardcoded datasets.
 */
export const ChartsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full select-none">
      {/* 1. Live Active Projects Progress Chart */}
      <ProjectProgressChart />

      {/* 2. Trailing 12-Month Completed Projects Chart */}
      <MonthlyCompletedChart />

      {/* 3. Technology Usage Stack Donut Chart */}
      <TechnologyUsageChart />

      {/* 4. Active Client Distribution Horizontal Bar Chart */}
      <ClientDistributionChart />
    </div>
  );
};

export default ChartsGrid;
