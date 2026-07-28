import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  useProjectPayments,
  usePaymentSummary,
  useDeliveryAssets,
  useCreatePayment,
  useDeletePayment,
  useCreateDeliveryAsset,
  useToggleManualUnlock,
  useDeleteDeliveryAsset,
  useUpdateProjectBudget,
} from '../../lib/supabase/queries/payments';
import { useProjects } from '../projects/hooks/useProjects';

import { PaymentAnalyticsCards } from './components/PaymentAnalyticsCards';
import { PaymentProgressBar } from './components/PaymentProgressBar';
import { PaymentTimeline } from './components/PaymentTimeline';
import { AddPaymentModal } from './components/AddPaymentModal';
import { DeliveryAssetsManager } from './components/DeliveryAssetsManager';
import { EditProjectBudgetModal } from './components/EditProjectBudgetModal';

import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Folder01Icon, MoneyBagIcon } from '@hugeicons/core-free-icons';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select';

interface PaymentsPageProps {
  projectId?: string;
  readOnly?: boolean;
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({
  projectId: propProjectId,
  readOnly = false,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(propProjectId || 'all');
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);

  const activeProjectId = propProjectId || (selectedProjectId === 'all' ? undefined : selectedProjectId);

  const { data: projectsResult } = useProjects();
  const { data: summary } = usePaymentSummary(activeProjectId);
  const { data: payments = [], isLoading: isLoadingPayments } = useProjectPayments(activeProjectId);
  const { data: assets = [], isLoading: isLoadingAssets } = useDeliveryAssets(activeProjectId, readOnly);

  const createPaymentMutation = useCreatePayment();
  const deletePaymentMutation = useDeletePayment();
  const createAssetMutation = useCreateDeliveryAsset();
  const toggleUnlockMutation = useToggleManualUnlock();
  const deleteAssetMutation = useDeleteDeliveryAsset();
  const updateBudgetMutation = useUpdateProjectBudget();

  const projectsOptions = useMemo(() => {
    const rawProjects =
      (projectsResult as any)?.projects ||
      (projectsResult as any)?.data ||
      (Array.isArray(projectsResult) ? projectsResult : []);

    return rawProjects.map((p: any) => ({
      id: String(p.id),
      name: p.name || p.title || 'Untitled Project',
    }));
  }, [projectsResult]);

  const selectedProjectName = useMemo(() => {
    if (selectedProjectId === 'all') return 'All Projects';
    const found = projectsOptions.find((p: any) => p.id === selectedProjectId);
    if (found) return found.name;
    return 'Select Project';
  }, [selectedProjectId, projectsOptions]);

  const stats = summary || {
    totalCost: 0,
    totalPaid: 0,
    remainingBalance: 0,
    paymentPercentage: 0,
    averagePayment: 0,
    largestPayment: 0,
    paymentsCount: 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="space-y-6 font-sans text-zinc-100 select-none pb-12"
    >
      {/* Module Header Toolbar */}
      <div className="p-2.5 sm:p-3 rounded-lg bg-[#0c0c0e]/90 border border-zinc-800/80 backdrop-blur-md flex items-center justify-between gap-2 sm:gap-3 font-mono text-xs shadow-md shrink-0 whitespace-nowrap overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!readOnly && !propProjectId && (
            <div className="w-36 sm:w-56 shrink-0">
              <Select value={selectedProjectId} onValueChange={(val) => setSelectedProjectId(val as string)}>
                <SelectTrigger className="h-8 text-[11px] px-2 sm:px-2.5 bg-zinc-900 border-zinc-800 font-mono text-zinc-200 hover:text-white flex items-center gap-1.5 rounded-md truncate max-w-full">
                  <HugeiconsIcon icon={Folder01Icon} size={13} className="text-zinc-400 shrink-0" />
                  <span className="truncate">{selectedProjectName}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projectsOptions.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold font-mono shrink-0">
            <HugeiconsIcon icon={MoneyBagIcon} size={15} className="text-zinc-500 shrink-0" />
            <span className="hidden sm:inline">Finances & Delivery Release</span>
            <span className="sm:hidden text-[11px]">Finances</span>
          </div>
        </div>

        {!readOnly && activeProjectId && (
          <button
            type="button"
            onClick={() => setIsAddPaymentOpen(true)}
            className="h-8 px-2.5 sm:px-3 rounded-md bg-white text-black font-semibold text-xs font-mono inline-flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition-colors cursor-pointer shadow-md shrink-0"
          >
            <HugeiconsIcon icon={Add01Icon} size={14} />
            <span className="hidden sm:inline">Record Payment</span>
            <span className="sm:hidden text-[11px]">Payment</span>
          </button>
        )}
      </div>

      {/* 1. Analytics Cards */}
      <PaymentAnalyticsCards
        stats={stats}
        currency="INR"
        onEditProjectValue={!readOnly && activeProjectId ? () => setIsEditBudgetOpen(true) : undefined}
      />

      {/* 2. Payment Progression Bar */}
      <PaymentProgressBar stats={stats} currency="INR" />

      {/* 3. Deliverables & Asset Releases */}
      <DeliveryAssetsManager
        assets={assets}
        projectId={activeProjectId || ''}
        onCreateAsset={async (input) => {
          await createAssetMutation.mutateAsync(input);
        }}
        onToggleManualUnlock={async (assetId, isManualUnlocked) => {
          await toggleUnlockMutation.mutateAsync({ assetId, isManualUnlocked });
        }}
        onDeleteAsset={async (assetId) => {
          await deleteAssetMutation.mutateAsync(assetId);
        }}
        readOnly={readOnly || !activeProjectId}
      />

      {/* 4. Payment Timeline */}
      <PaymentTimeline
        payments={payments}
        currency="INR"
        onDeletePayment={(id) => deletePaymentMutation.mutate(id)}
        readOnly={readOnly}
      />

      {/* Add Payment Modal */}
      {activeProjectId && (
        <AddPaymentModal
          isOpen={isAddPaymentOpen}
          onClose={() => setIsAddPaymentOpen(false)}
          onSubmit={async (input) => {
            await createPaymentMutation.mutateAsync(input);
          }}
          projectId={activeProjectId}
          isSubmitting={createPaymentMutation.isPending}
        />
      )}

      {/* Set Total Project Value Modal */}
      {activeProjectId && (
        <EditProjectBudgetModal
          isOpen={isEditBudgetOpen}
          onClose={() => setIsEditBudgetOpen(false)}
          onSubmit={async (budget) => {
            await updateBudgetMutation.mutateAsync({ projectId: activeProjectId, budget });
          }}
          currentBudget={stats.totalCost}
          isSubmitting={updateBudgetMutation.isPending}
        />
      )}
    </motion.div>
  );
};

export default PaymentsPage;
