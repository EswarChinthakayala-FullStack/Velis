import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useClients } from './hooks/useClients';
import { ClientToolbar } from './components/ClientToolbar';
import { ClientsTable } from './components/ClientsTable';
import { ClientFormDrawer } from './client-form-drawer';
import { ClientSkeleton } from './components/ClientSkeleton';
import { ClientEmptyState } from './components/ClientEmptyState';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

/**
 * ClientsListPage Component (PHASE 06)
 * Enterprise Client Directory for Velis.
 * 
 * Backed 100% by live Supabase queries via React Query v5 and TanStack Table v8.
 * Strictly production-only: ZERO mock data or dummy rows.
 */
export const ClientsListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch client directory from Supabase
  const { data, isLoading, isError, refetch } = useClients({
    search,
    status: statusFilter,
    page,
    pageSize: 20,
  });

  const clients = data?.clients || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="w-full max-w-[1600px] mx-auto space-y-6 text-zinc-100 select-none"
    >
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Client Directory</h1>
          <p className="text-xs text-zinc-400 font-normal">
            Manage your client accounts, active contracts, and portal access permissions.
          </p>
        </div>
      </div>

      {/* 2. Toolbar */}
      <ClientToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        onRefresh={() => refetch()}
        onNewClient={() => setIsDrawerOpen(true)}
        totalCount={totalCount}
      />

      {/* 3. DataTable Body / Skeleton / Empty State */}
      {isLoading && <ClientSkeleton />}

      {isError && (
        <div className="p-8 text-center border border-zinc-800 rounded-lg space-y-3">
          <p className="text-xs text-zinc-400 font-mono">Unable to load client directory.</p>
          <button
            onClick={() => refetch()}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-medium"
          >
            Retry Query
          </button>
        </div>
      )}

      {!isLoading && !isError && clients.length === 0 && (
        <ClientEmptyState onNewClient={() => setIsDrawerOpen(true)} />
      )}

      {!isLoading && !isError && clients.length > 0 && (
        <div className="space-y-4">
          <ClientsTable data={clients} />

          {/* 4. Server-Side Pagination Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-zinc-400 font-mono">
            <span>
              Showing {Math.min((page - 1) * 20 + 1, totalCount)}–{Math.min(page * 20, totalCount)} of {totalCount} clients
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                <span>Previous</span>
              </button>

              <span className="px-2 font-bold text-white">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Unified Create Client Slide-Over Drawer */}
      <ClientFormDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} mode="create" />
    </motion.div>
  );
};

export default ClientsListPage;
