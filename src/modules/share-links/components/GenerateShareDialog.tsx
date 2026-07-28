import React, { useState } from 'react';
import { getPasswordStrength } from '../lib/utils/share-link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  LockKeyIcon,
  ViewIcon,
  ViewOffIcon,
  Calendar01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Share01Icon,
} from '@hugeicons/core-free-icons';
import type { ExpirationOption } from '../lib/types/share-link';
import type { GenerateShareLinkFormValues } from '../lib/schemas/share-link.schema';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components/ui/select';

import { useSharePortalSettings } from '../../settings/hooks/useSettings';

interface GenerateShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (values: GenerateShareLinkFormValues) => void;
  projects?: Array<{ id: string; name: string }>;
  defaultProjectId?: string | null;
  isLoading?: boolean;
}

export const GenerateShareDialog: React.FC<GenerateShareDialogProps> = ({
  isOpen,
  onClose,
  onGenerate,
  projects = [],
  defaultProjectId,
  isLoading = false,
}) => {
  const { data: sharePortalSettings } = useSharePortalSettings();

  const [projectId, setProjectId] = useState<string>(
    defaultProjectId && defaultProjectId !== 'all' ? defaultProjectId : (projects[0]?.id || '')
  );
  const [expirationPreset, setExpirationPreset] = useState<ExpirationOption>('30d');
  const [customExpirationDate, setCustomExpirationDate] = useState<string>('');
  const [hasPassword, setHasPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && sharePortalSettings) {
      if (sharePortalSettings.requirePassword) {
        setHasPassword(true);
      }
      if (sharePortalSettings.defaultExpirationDays === 7) {
        setExpirationPreset('7d');
      } else if (sharePortalSettings.defaultExpirationDays === 90) {
        setExpirationPreset('90d');
      } else if (sharePortalSettings.defaultExpirationDays === 30) {
        setExpirationPreset('30d');
      }
    }
  }, [isOpen, sharePortalSettings]);

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const targetProjectId = projectId || defaultProjectId || (projects[0]?.id || '');
    if (!targetProjectId || targetProjectId === 'all') {
      setErrorMsg('Please select a project for the share link');
      return;
    }

    if (expirationPreset === 'custom' && (!customExpirationDate || new Date(customExpirationDate) <= new Date())) {
      setErrorMsg('Custom expiration date must be in the future');
      return;
    }

    if (hasPassword && (!password || password.trim().length < 6)) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    onGenerate({
      projectId: targetProjectId,
      expirationPreset,
      customExpirationDate: expirationPreset === 'custom' ? customExpirationDate : null,
      hasPassword,
      password: hasPassword ? password : null,
      notes: notes.trim() || null,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-lg rounded-lg bg-[#0c0c0e] border border-zinc-800 shadow-2xl overflow-hidden font-sans text-zinc-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-zinc-800/80 bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700/60">
                <HugeiconsIcon icon={Share01Icon} size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Generate Share Link</h3>
                <p className="text-xs text-zinc-400">Create a secure client portal access link</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            {/* Custom UI Select Component for Project Selection */}
            {projects.length > 0 && (!defaultProjectId || defaultProjectId === 'all') && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400">Select Project *</label>
                <Select value={projectId} onValueChange={(val) => setProjectId(val as string)}>
                  <SelectTrigger className="w-full h-9 bg-zinc-900 border-zinc-800 rounded-lg text-xs font-mono text-white focus:border-zinc-600">
                    <SelectValue placeholder="Select a project *">
                      {projects.find((p) => p.id === projectId)?.name || projects[0]?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Expiration Configuration */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400">Expiration Period</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {(['never', '1d', '7d', '30d', '90d', 'custom'] as ExpirationOption[]).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setExpirationPreset(preset)}
                    className={`px-2 py-1.5 rounded-lg border text-[11px] font-mono transition-colors capitalize cursor-pointer ${
                      expirationPreset === preset
                        ? 'bg-zinc-800 border-zinc-600 text-white font-medium shadow'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {preset === 'never' ? 'Never' : preset}
                  </button>
                ))}
              </div>

              {expirationPreset === 'custom' && (
                <div className="mt-2 space-y-1">
                  <div className="relative">
                    <input
                      type="date"
                      value={customExpirationDate}
                      onChange={(e) => setCustomExpirationDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-zinc-600"
                    />
                    <HugeiconsIcon icon={Calendar01Icon} size={14} className="absolute right-3 top-2.5 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* Password Protection */}
            <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={LockKeyIcon} size={16} className="text-amber-400" />
                  <span className="text-xs font-medium text-zinc-200 font-sans">Password Protection</span>
                </div>
                <input
                  type="checkbox"
                  id="hasPassword"
                  checked={hasPassword}
                  onChange={(e) => setHasPassword(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-white accent-white cursor-pointer"
                />
              </div>

              {hasPassword && (
                <div className="space-y-2 pt-1 border-t border-zinc-800/60">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter access password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} size={14} />
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                        <span>Strength: {passwordStrength.label}</span>
                        <span>{passwordStrength.score} / 4</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden flex gap-1">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-full flex-1 rounded-full transition-colors ${
                              idx < passwordStrength.score ? passwordStrength.color : 'bg-zinc-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Read-Only Permission Callout */}
            <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-center gap-2.5 text-xs text-zinc-400 font-sans">
              <HugeiconsIcon icon={InformationCircleIcon} size={16} className="text-zinc-500 shrink-0" />
              <span>Share portals provide read-only access. Clients cannot modify data.</span>
            </div>

            {/* Internal Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Internal Note (Optional)</label>
              <textarea
                placeholder="Client reference or description..."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-zinc-600 resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-300 text-xs font-sans hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-sans font-medium text-xs hover:bg-zinc-200 transition-colors cursor-pointer shadow-lg disabled:opacity-50"
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
                <span>{isLoading ? 'Generating...' : 'Generate Link'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
