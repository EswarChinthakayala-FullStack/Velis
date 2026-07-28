export type UploadTaskStatus =
  | 'idle'
  | 'compressing'
  | 'uploading'
  | 'success'
  | 'error'
  | 'cancelled';

export interface BatchUploadTask {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  description: string;
  moduleName: string;
  milestoneId: string | null;
  status: UploadTaskStatus;
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
  speedBytesPerSec: number;
  remainingSeconds: number;
  error?: string;
  controller?: AbortController;
  storagePath?: string;
}

export function createBatchUploadTask(file: File): BatchUploadTask {
  const title = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
  return {
    id: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
    title,
    description: '',
    moduleName: 'General',
    milestoneId: null,
    status: 'idle',
    progress: 0,
    uploadedBytes: 0,
    totalBytes: file.size,
    speedBytesPerSec: 0,
    remainingSeconds: 0,
  };
}
