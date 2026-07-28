import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useClient } from './hooks/useClient';
import { useClientProjects } from './hooks/useClientProjects';
import { useClientStatistics } from './hooks/useClientStatistics';
import { ClientHeader } from './components/ClientHeader';
import { ClientProfileCard } from './components/ClientProfileCard';
import { ClientStatistics } from './components/ClientStatistics';
import { ClientContactCard } from './components/ClientContactCard';
import { ClientNotesCard } from './components/ClientNotesCard';
import { ClientSocialLinks } from './components/ClientSocialLinks';
import { ClientGitHubCard } from './components/ClientGitHubCard';
import { ClientProjectsTable } from './components/ClientProjectsTable';
import { ClientFormDrawer } from './client-form-drawer';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';

/**
 * ClientDetailPage Component (PHASE 06)
 * Enterprise Client Detail Workspace for Velis.
 * 
 * Backed 100% by live Supabase queries via React Query v5 and TanStack Table v8.
 * Strictly production-only: ZERO mock data or fabricated history.
 */
export const ClientDetailPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // 1. Fetch single client profile
  const { data: client, isLoading: isClientLoading, isError: isClientError, refetch } = useClient(clientId);

  // 2. Fetch projects for this client
  const { data: projects = [], isLoading: isProjectsLoading } = useClientProjects(clientId);

  // 3. Fetch stats for this client
  const { data: stats, isLoading: isStatsLoading } = useClientStatistics(clientId);

  if (isClientLoading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto space-y-6 animate-pulse select-none">
        <div className="h-10 w-64 bg-zinc-900/60 rounded-lg" />
        <div className="h-32 bg-zinc-900/60 rounded-lg border border-zinc-800/40" />
        <div className="grid grid-cols-4 gap-4 h-24">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-900/60 rounded-lg border border-zinc-800/40" />
          ))}
        </div>
      </div>
    );
  }

  if (isClientError || !client) {
    return (
      <div className="w-full max-w-[1600px] mx-auto p-12 text-center border border-zinc-800/80 rounded-lg bg-[rgba(17,17,19,0.85)] space-y-4 select-none">
        <h3 className="text-base font-bold text-white tracking-tight">Client Account Not Found</h3>
        <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto">
          The requested client record does not exist or may have been deleted from Supabase.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/app/clients')}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
            <span>Return to Client Directory</span>
          </button>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-medium cursor-pointer"
          >
            Retry Query
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="w-full max-w-[1600px] mx-auto space-y-6 text-zinc-100 select-none"
    >
      {/* 1. Header Bar with Quick Action Buttons */}
      <ClientHeader client={client} onEdit={() => setIsEditOpen(true)} />

      {/* 2. Profile Summary Card */}
      <ClientProfileCard client={client} />

      {/* 3. Executive KPI Statistics Grid */}
      <ClientStatistics stats={stats} isLoading={isStatsLoading} />

      {/* 4. Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contact Details, Notes, Social Links, GitHub */}
        <div className="lg:col-span-1 space-y-6">
          <ClientContactCard client={client} />
          <ClientNotesCard notes={client.notes} />
          <ClientSocialLinks socialLinks={client.socialLinks} />
          <ClientGitHubCard githubUsername={client.githubUsername} />
        </div>

        {/* Right Column: Client Projects Table (TanStack Table v8) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800/60">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Client Projects</h3>
              <p className="text-xs text-zinc-400 font-mono">
                Active and historical contract deliverables assigned to this client account.
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-zinc-800 text-white border border-zinc-700 shrink-0 whitespace-nowrap self-start sm:self-auto">
              {projects.length} Projects
            </span>
          </div>

          <ClientProjectsTable projects={projects} isLoading={isProjectsLoading} />
        </div>
      </div>

      {/* 5. Edit Client Slide-Over Drawer */}
      <ClientFormDrawer
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        mode="edit"
        client={client}
      />
    </motion.div>
  );
};

export default ClientDetailPage;
