import { useState, useCallback } from 'react';
import { isAllowedImageType, MAX_FILE_SIZE_BYTES, formatBytes } from '../lib/utils/mime-utils';

export interface FileValidationError {
  fileName: string;
  reason: string;
}

export function useUploadValidation() {
  const [validationErrors, setValidationErrors] = useState<FileValidationError[]>([]);

  const validateFiles = useCallback((files: File[]): { validFiles: File[]; errors: FileValidationError[] } => {
    const validFiles: File[] = [];
    const errors: FileValidationError[] = [];

    for (const file of files) {
      if (!isAllowedImageType(file.type)) {
        errors.push({
          fileName: file.name,
          reason: `Unsupported file type (${file.type || 'unknown'}). Allowed: PNG, JPG, WEBP, GIF, AVIF.`,
        });
        continue;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push({
          fileName: file.name,
          reason: `File size (${formatBytes(file.size)}) exceeds maximum limit of ${formatBytes(MAX_FILE_SIZE_BYTES)}.`,
        });
        continue;
      }

      if (file.size === 0) {
        errors.push({
          fileName: file.name,
          reason: 'File is empty (0 bytes).',
        });
        continue;
      }

      validFiles.push(file);
    }

    setValidationErrors(errors);
    return { validFiles, errors };
  }, []);

  const clearErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  return { validationErrors, validateFiles, clearErrors };
}
