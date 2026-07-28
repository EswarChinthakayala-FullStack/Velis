import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { ChartSkeleton } from '../components/ChartSkeleton';
import { ChartEmptyState } from '../components/ChartEmptyState';
import { ChartErrorState } from '../components/ChartErrorState';
import { useTechnologyUsageChart } from '../hooks/useTechnologyUsageChart';

const MONOCHROME_TECH_COLORS = ['#FAFAFA', '#D4D4D8', '#A1A1AA', '#71717A', '#52525B', '#3F3F46', '#27272A'];

export const TechnologyUsageChart: React.FC = () => {
  const { data, isLoading, isError, refetch } = useTechnologyUsageChart();

  if (isLoading) return <ChartSkeleton />;

  if (isError) {
    return (
      <ChartCard title="Technology Usage Distribution" description="Tech stack allocation across projects">
        <ChartErrorState message="Failed to load technology usage analytics." onRetry={() => refetch()} />
      </ChartCard>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartCard title="Technology Usage Distribution" description="Tech stack allocation across projects">
        <ChartEmptyState
          title="No technologies assigned yet"
          description="Add technologies to your active project specifications in Supabase to view live stack distribution."
        />
      </ChartCard>
    );
  }

  const totalTags = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <ChartCard
      title="Technology Usage Distribution"
      description="Tech stack allocation across projects"
      badge={`${data.length} Stacks`}
      onRefresh={() => refetch()}
    >
      <div className="h-36 w-full min-w-0 relative" style={{ minWidth: 0, minHeight: 140 }}>
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={60}
              paddingAngle={3}
              dataKey="count"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={MONOCHROME_TECH_COLORS[index % MONOCHROME_TECH_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181B',
                borderColor: '#3F3F46',
                borderRadius: '8px',
                color: '#FAFAFA',
                fontSize: '12px',
              }}
              formatter={(val: any, name: any) => [`${val} projects (${Math.round((Number(val)/totalTags)*100)}%)`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tech Stack Legend */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/60 max-h-20 overflow-y-auto">
        {data.slice(0, 6).map((item, index) => (
          <div key={item.name} className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900/60 border border-zinc-800/60 text-[10px] font-mono">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: MONOCHROME_TECH_COLORS[index % MONOCHROME_TECH_COLORS.length] }}
            />
            <span className="text-zinc-300 truncate max-w-[90px]">{item.name}</span>
            <span className="text-white font-bold">{item.count}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

export default TechnologyUsageChart;
