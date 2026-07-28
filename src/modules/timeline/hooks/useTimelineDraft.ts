import { useState, useEffect, useCallback } from 'react';
import type { TimelineUpdateFormValues } from '../lib/schemas/timeline-update.schema';

export type DraftStatus = 'saved' | 'saving' | 'unsaved';

export function useTimelineDraft(projectId?: string) {
  const [draftStatus, setDraftStatus] = useState<DraftStatus>('saved');
  const storageKey = projectId ? `velis-timeline-draft-${projectId}` : 'velis-timeline-draft-global';

  // Load initial draft from localStorage
  const loadDraft = useCallback((): Partial<TimelineUpdateFormValues> | null => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }, [storageKey]);

  // Save draft to localStorage
  const saveDraft = useCallback(
    (values: Partial<TimelineUpdateFormValues>) => {
      if (!projectId) return;
      try {
        setDraftStatus('saving');
        localStorage.setItem(storageKey, JSON.stringify({ ...values, updatedAt: Date.now() }));
        setTimeout(() => {
          setDraftStatus('saved');
        }, 400);
      } catch {
        setDraftStatus('unsaved');
      }
    },
    [projectId, storageKey]
  );

  // Clear draft upon successful publish
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setDraftStatus('saved');
    } catch {
      // Ignore
    }
  }, [storageKey]);

  return {
    draftStatus,
    setDraftStatus,
    loadDraft,
    saveDraft,
    clearDraft,
  };
}

export default useTimelineDraft;
