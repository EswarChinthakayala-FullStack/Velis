import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { ChartSkeleton } from '../components/ChartSkeleton';
import { ChartEmptyState } from '../components/ChartEmptyState';
import { ChartErrorState } from '../components/ChartErrorState';
import { useClientDistributionChart } from '../hooks/useClientDistributionChart';

export const ClientDistributionChart: React.FC = () => {
  const { data, isLoading, isError, refetch } = useClientDistributionChart();

  if (isLoading) return <ChartSkeleton />;

  if (isError) {
    return (
      <ChartCard title="Client Project Distribution" description="Active project allocation by client account">
        <ChartErrorState message="Failed to load client distribution analytics." onRetry={() => refetch()} />
      </ChartCard>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartCard title="Client Project Distribution" description="Active project allocation by client account">
        <ChartEmptyState
          title="No client distribution data available"
          description="Assign clients to active projects in Supabase to see real-time account breakdown."
        />
      </ChartCard>
    );
  }

  const totalClients = data.length;

  return (
    <ChartCard
      title="Client Project Distribution"
      description="Active project allocation by client account"
      badge={`${totalClients} Clients`}
      onRefresh={() => refetch()}
    >
      <div className="h-48 w-full min-w-0" style={{ minWidth: 0, minHeight: 180 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180} debounce={50}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <XAxis type="number" stroke="#71717A" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="clientName"
              stroke="#71717A"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: '#18181B',
                borderColor: '#3F3F46',
                borderRadius: '8px',
                color: '#FAFAFA',
                fontSize: '12px',
              }}
              formatter={(val: any) => [`${val} active projects`, 'Client']}
            />
            <Bar dataKey="projectCount" fill="#FAFAFA" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default ClientDistributionChart;
