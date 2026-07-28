import type { ComponentType } from 'react';

export interface KPICardData {
  id: string;
  title: string;
  value: number;
  label: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral' | 'live';
  icon: any;
  updatedAt?: string;
}

export interface KPICardProps {
  data?: KPICardData;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onClick?: () => void;
}

export interface KPIMetric {
  id: string;
  title: string;
  value: number | string;
  label: string;
  change: string;
  isPositive: boolean;
  icon: any;
  sparkline: number[];
  updatedAt: string;
}

export interface ProjectStatusData {
  status: string;
  count: number;
  color: string;
}

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface ProjectGrowthData {
  month: string;
  projects: number;
}

export interface GitHubActivityData {
  day: string;
  commits: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  action: string;
  entityType: string;
  projectName?: string;
  timestamp: string;
  icon: any;
}

export interface InsightItem {
  id: string;
  title: string;
  category: 'warning' | 'info' | 'success';
  actionLabel?: string;
  actionRoute?: string;
  onClickAction?: () => void;
}
