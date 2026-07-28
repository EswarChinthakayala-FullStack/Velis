import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { ChartSkeleton } from '../components/ChartSkeleton';
import { ChartEmptyState } from '../components/ChartEmptyState';
import { ChartErrorState } from '../components/ChartErrorState';
import { useMonthlyCompletedChart } from '../hooks/useMonthlyCompletedChart';

export const MonthlyCompletedChart: React.FC = () => {
  const { data, isLoading, isError, refetch } = useMonthlyCompletedChart();

  if (isLoading) return <ChartSkeleton />;

  if (isError) {
    return (
      <ChartCard title="Monthly Completed Projects" description="Trailing 12-month delivery stream">
        <ChartErrorState message="Failed to load monthly completion analytics." onRetry={() => refetch()} />
      </ChartCard>
    );
  }

  const totalCompleted = data?.reduce((acc, curr) => acc + curr.completedCount, 0) ?? 0;

  if (!data || totalCompleted === 0) {
    return (
      <ChartCard title="Monthly Completed Projects" description="Trailing 12-month delivery stream">
        <ChartEmptyState
          title="No completed projects recorded yet"
          description="Mark projects as completed to populate your trailing 12-month timeline."
        />
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Monthly Completed Projects"
      description="Trailing 12-month delivery stream"
      badge={`${totalCompleted} Completed`}
      onRefresh={() => refetch()}
    >
      <div className="h-48 w-full min-w-0" style={{ minWidth: 0, minHeight: 180 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180} debounce={50}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="month" stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: '#18181B',
                borderColor: '#3F3F46',
                borderRadius: '8px',
                color: '#FAFAFA',
                fontSize: '12px',
              }}
              formatter={(val: any) => [`${val} projects`, 'Completed']}
            />
            <Bar dataKey="completedCount" fill="#FAFAFA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default MonthlyCompletedChart;
