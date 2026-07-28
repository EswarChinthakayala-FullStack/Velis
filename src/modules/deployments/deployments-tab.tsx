import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useProjectDeployments,
  useDeleteDeployment,
} from './lib/supabase/queries/deployments';
import { useDeploymentSummary } from './hooks/useDeploymentSummary';
import { useDeploymentHistory } from './hooks/useDeploymentHistory';
import { useProjects } from '../projects/hooks/useProjects';

import { DeploymentHeader, type ProjectOption } from './components/DeploymentHeader';
import { DeploymentSummaryCards } from './components/DeploymentSummaryCards';
import { DeploymentTable } from './components/DeploymentTable';
import { DeploymentHistory } from './components/DeploymentHistory';
import { DeploymentEmptyState } from './components/DeploymentEmptyState';
import { DeploymentSkeleton } from './components/DeploymentSkeleton';
import { CreateDeploymentModal } from './components/CreateDeploymentModal';
import type { DeploymentItem } from './types/deployment';

export interface DeploymentsTabProps {
  projectId?: string;
  readOnly?: boolean;
  className?: string;
}

export const DeploymentsTab: React.FC<DeploymentsTabProps> = ({
  projectId,
  readOnly = false,
  className = '',
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnv, setSelectedEnv] = useState<string>('all');
  const [selectedHealth, setSelectedHealth] = useState<string>('all');

  const activeProjectId = projectId || (selectedProjectId === 'all' ? undefined : selectedProjectId);

  // Queries & Mutations
  const { data: deployments = [], isLoading } = useProjectDeployments(activeProjectId);
  const deleteMutation = useDeleteDeployment();

  const { data: projectsResult } = useProjects();

  // Summary & History
  const summary = useDeploymentSummary(deployments);
  const history = useDeploymentHistory(deployments);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<DeploymentItem | null>(null);

  const projectsOptions: ProjectOption[] = useMemo(() => {
    const raw =
      (projectsResult as any)?.data ||
      (projectsResult as any)?.projects ||
      (Array.isArray(projectsResult) ? projectsResult : []);

    return raw.map((p: any) => ({
      id: String(p.id),
      name: p.name || p.title || 'Untitled Project',
    }));
  }, [projectsResult]);

  // Filtered Deployments
  const filteredDeployments = useMemo(() => {
    return deployments.filter((d) => {
      // Env filter
      if (selectedEnv !== 'all' && d.environment !== selectedEnv) {
        return false;
      }
      // Health filter
      if (selectedHealth !== 'all' && d.healthStatus !== selectedHealth) {
        return false;
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const matchEnv = d.environment.toLowerCase().includes(q);
      const matchVersion = d.version?.toLowerCase().includes(q);
      const matchBranch = d.branch?.toLowerCase().includes(q);
      const matchCommit = d.commitSha?.toLowerCase().includes(q);
      const matchProvider = d.provider?.toLowerCase().includes(q);

      return matchEnv || matchVersion || matchBranch || matchCommit || matchProvider;
    });
  }, [deployments, selectedEnv, selectedHealth, searchQuery]);

  const handleEdit = (item: DeploymentItem) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const isSearchFiltered =
    Boolean(searchQuery.trim()) || selectedEnv !== 'all' || selectedHealth !== 'all';

  return (
    <div className={`space-y-5 font-mono ${className}`}>
      {/* Header */}
      <DeploymentHeader
        totalCount={filteredDeployments.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedEnv={selectedEnv}
        onEnvChange={setSelectedEnv}
        selectedHealth={selectedHealth}
        onHealthChange={setSelectedHealth}
        onOpenCreateModal={handleCreateNew}
        projects={projectId ? undefined : projectsOptions}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        readOnly={readOnly}
      />

      {/* Main Content */}
      {isLoading ? (
        <DeploymentSkeleton />
      ) : filteredDeployments.length === 0 ? (
        <DeploymentEmptyState
          isSearchFiltered={isSearchFiltered}
          onResetFilters={() => {
            setSearchQuery('');
            setSelectedEnv('all');
            setSelectedHealth('all');
          }}
          onOpenCreateModal={handleCreateNew}
          readOnly={readOnly}
        />
      ) : (
        <div className="space-y-5">
          {/* Summary Metric Cards */}
          <DeploymentSummaryCards summary={summary} />

          {/* Deployment Table */}
          <DeploymentTable
            deployments={filteredDeployments}
            onEdit={readOnly ? undefined : handleEdit}
            onDelete={readOnly ? undefined : handleDelete}
            readOnly={readOnly}
          />

          {/* Deployment Timeline History */}
          <DeploymentHistory deployments={history} />
        </div>
      )}

      {/* Create / Edit Modal */}
      {!readOnly && (
        <CreateDeploymentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setItemToEdit(null);
          }}
          projectId={activeProjectId || projectsOptions[0]?.id || ''}
          itemToEdit={itemToEdit}
        />
      )}
    </div>
  );
};

export default DeploymentsTab;
