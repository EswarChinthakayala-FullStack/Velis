import { z } from 'zod';

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  portfolio?: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  timezone?: string;
  website?: string;
  notes?: string;
  githubUsername?: string;
  socialLinks?: SocialLinks;
  activeProjectsCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

export interface ClientProject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completionPercent: number;
  color?: string;
  startDate?: string;
  deadline?: string;
  updatedAt: string;
}

export interface ClientStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
}

export interface ClientQueryFilter {
  search?: string;
  country?: string;
  status?: 'all' | 'active' | 'inactive';
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'created_at' | 'company';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedClientsResult {
  clients: ClientRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
