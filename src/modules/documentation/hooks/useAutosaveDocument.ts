import { useState, useRef, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { updateDocument, createDocumentVersionRecord } from '../../../lib/supabase/queries/documentation';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutosaveDocumentOptions {
  documentId: string;
  initialContent: string;
  initialVersion: string;
  author?: string;
  debounceMs?: number;
  onSaveSuccess?: (version: string) => void;
}

export function useAutosaveDocument({
  documentId,
  initialContent,
  initialVersion,
  author = 'System Lead',
  debounceMs = 1200,
  onSaveSuccess,
}: UseAutosaveDocumentOptions) {
  const [content, setContent] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<SaveState>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [currentVersion, setCurrentVersion] = useState(initialVersion);

  const lastSavedContentRef = useRef(initialContent);

  useEffect(() => {
    setContent(initialContent);
    lastSavedContentRef.current = initialContent;
    setCurrentVersion(initialVersion);
  }, [initialContent, initialVersion, documentId]);

  // Internal save executor
  const saveContent = useCallback(
    async (textToSave: string) => {
      if (!documentId || textToSave === lastSavedContentRef.current) {
        return;
      }

      setSaveStatus('saving');

      try {
        // Increment minor version (e.g. 1.0.0 -> 1.0.1)
        const parts = currentVersion.split('.');
        let nextVer = currentVersion;
        if (parts.length === 3 && !isNaN(Number(parts[2]))) {
          nextVer = `${parts[0]}.${parts[1]}.${Number(parts[2]) + 1}`;
        }

        // 1. Update Document
        await updateDocument(documentId, {
          content: textToSave,
          version: nextVer,
        });

        // 2. Insert Revision Version
        await createDocumentVersionRecord(
          documentId,
          textToSave,
          nextVer,
          author,
          'Autosaved revision'
        );

        lastSavedContentRef.current = textToSave;
        setCurrentVersion(nextVer);
        setSaveStatus('saved');
        setLastSavedTime(new Date());

        if (onSaveSuccess) {
          onSaveSuccess(nextVer);
        }
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('error');
      }
    },
    [documentId, currentVersion, author, onSaveSuccess]
  );

  // Debounced save ref
  const debouncedSaveRef = useRef(
    debounce((text: string) => {
      saveContent(text);
    }, debounceMs)
  );

  useEffect(() => {
    const debouncer = debouncedSaveRef.current;
    return () => {
      debouncer.cancel();
    };
  }, []);

  const handleChangeContent = (newText: string) => {
    setContent(newText);

    if (newText !== lastSavedContentRef.current) {
      setSaveStatus('saving');
      debouncedSaveRef.current(newText);
    }
  };

  const forceSaveNow = async () => {
    debouncedSaveRef.current.cancel();
    await saveContent(content);
  };

  return {
    content,
    setContent: handleChangeContent,
    saveStatus,
    lastSavedTime,
    currentVersion,
    forceSaveNow,
  };
}

export default useAutosaveDocument;
