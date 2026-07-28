import React, { useState, useEffect } from 'react';
import { usePaymentSummary, useProjectPayments, useDeliveryAssets } from '../../../lib/supabase/queries/payments';
import { PaymentProgressBar } from '../../payments/components/PaymentProgressBar';
import { PaymentTimeline } from '../../payments/components/PaymentTimeline';
import { PaymentUnlockPopup } from './PaymentUnlockPopup';
import { parseGoogleDriveUrl } from '../../payments/lib/utils/google-drive';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  LockKeyIcon,
  CheckmarkCircle02Icon,
  Link01Icon,
  SecurityCheckIcon,
  Video01Icon,
  DocumentCodeIcon,
  Folder01Icon,
  Key01Icon,
  QrCodeIcon,
} from '@hugeicons/core-free-icons';

interface PortalPaymentViewProps {
  projectId?: string;
}

export const PortalPaymentView: React.FC<PortalPaymentViewProps> = ({ projectId }) => {
  const { data: summary } = usePaymentSummary(projectId);
  const { data: payments = [] } = useProjectPayments(projectId);
  const { data: assets = [] } = useDeliveryAssets(projectId, true);
  const [isQrPopupOpen, setIsQrPopupOpen] = useState(false);
  const [hasAutoPopped, setHasAutoPopped] = useState(false);

  const stats = summary || {
    totalCost: 0,
    totalPaid: 0,
    remainingBalance: 0,
    paymentPercentage: 0,
    averagePayment: 0,
    largestPayment: 0,
    paymentsCount: 0,
  };

  // Auto-pop UPI QR modal on load if remaining balance is > 0
  useEffect(() => {
    if (stats.remainingBalance > 0 && !hasAutoPopped) {
      setIsQrPopupOpen(true);
      setHasAutoPopped(true);
    }
  }, [stats.remainingBalance, hasAutoPopped]);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'setup_video':
        return Video01Icon;
      case 'credentials':
        return Key01Icon;
      case 'source_code':
      case 'deployment_guide':
      case 'api_docs':
        return DocumentCodeIcon;
      default:
        return Folder01Icon;
    }
  };

  return (
    <div className="w-full space-y-6 font-mono select-none">
      {/* Outstanding Payment Unlock Banner */}
      {stats.remainingBalance > 0 && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-amber-950/40 via-[#0c0c0e] to-emerald-950/30 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <HugeiconsIcon icon={LockKeyIcon} size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-sans flex items-center gap-2">
                <span>Outstanding Balance: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.remainingBalance)}</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-semibold text-amber-400 uppercase">Unpaid</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Pay remaining balance to automatically unlock production setup video, source code & test suites.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsQrPopupOpen(true)}
            className="h-9 px-3.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs font-mono inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shrink-0"
          >
            <HugeiconsIcon icon={QrCodeIcon} size={15} />
            <span>Pay via UPI QR</span>
          </button>
        </div>
      )}

      {/* Financial Summary & Progression */}
      <PaymentProgressBar stats={stats} currency="INR" />

      {/* Deliverables & Final Assets Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
          <HugeiconsIcon icon={SecurityCheckIcon} size={14} className="text-zinc-500" />
          <span>Project Deliverables & Release Resources</span>
        </div>

        {assets.length === 0 ? (
          <div className="p-6 rounded-lg bg-[#0c0c0d] border border-zinc-800/60 text-center text-xs text-zinc-500">
            No specific release deliverables configured for this project yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {assets.map((asset) => {
              const IconComponent = getAssetIcon(asset.assetType);
              const driveInfo = parseGoogleDriveUrl(asset.assetUrl);
              const isUnlocked = asset.isUnlocked;

              return (
                <div
                  key={asset.id}
                  className={`p-4 rounded-lg bg-[#0c0c0d] border transition-colors flex flex-col justify-between space-y-3 ${
                    isUnlocked ? 'border-zinc-800/80' : 'border-amber-900/30 bg-amber-950/5'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                            isUnlocked
                              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                              : 'bg-zinc-900 border border-zinc-800 text-amber-400'
                          }`}
                        >
                          <HugeiconsIcon icon={IconComponent} size={16} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white font-sans truncate">{asset.title}</h4>
                          <div className="text-[10px] text-zinc-500 capitalize">{asset.assetType.replace(/_/g, ' ')}</div>
                        </div>
                      </div>

                      {/* Locked / Unlocked State Badge */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shrink-0 ${
                          isUnlocked
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                        }`}
                      >
                        <HugeiconsIcon icon={isUnlocked ? CheckmarkCircle02Icon : LockKeyIcon} size={11} />
                        {isUnlocked ? 'Available' : 'Locked'}
                      </span>
                    </div>

                    {asset.description && (
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-2">
                        {asset.description}
                      </p>
                    )}
                  </div>

                  {/* Google Drive Video Embed if unlocked */}
                  {isUnlocked && driveInfo.isValid && driveInfo.embedUrl && (
                    <div className="w-full aspect-video rounded-md bg-zinc-950 border border-zinc-800 overflow-hidden">
                      <iframe
                        src={driveInfo.embedUrl}
                        className="w-full h-full border-none"
                        title={asset.title}
                        allow="autoplay"
                      />
                    </div>
                  )}

                  {/* Resource Action */}
                  <div className="pt-2 border-t border-zinc-800/40 flex items-center justify-between">
                    {isUnlocked ? (
                      <a
                        href={asset.assetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="h-8 px-3 rounded-md bg-white text-black font-semibold text-xs font-mono inline-flex items-center gap-1.5 hover:bg-zinc-200 transition-colors shadow-md cursor-pointer"
                      >
                        <HugeiconsIcon icon={Link01Icon} size={12} />
                        <span>{driveInfo.isValid ? 'Open Google Drive Resource' : 'Access Deliverable'}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-amber-400/90 font-mono">
                        <HugeiconsIcon icon={LockKeyIcon} size={13} className="shrink-0" />
                        <span>Complete payment to unlock this deliverable</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Timeline & Invoices */}
      <PaymentTimeline payments={payments} currency="INR" readOnly={true} />

      {/* Payment Unlock UPI QR Popup */}
      <PaymentUnlockPopup
        isOpen={isQrPopupOpen}
        onClose={() => setIsQrPopupOpen(false)}
        remainingAmount={stats.remainingBalance}
        currency="INR"
      />
    </div>
  );
};

export default PortalPaymentView;
