import { z } from 'zod';

export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, 'Folder name is required')
    .max(100, 'Folder name cannot exceed 100 characters')
    .regex(/^[^/\\:*?"<>|]+$/, 'Folder name contains invalid characters'),
  parentId: z.string().nullable().optional(),
});

export const renameFileSchema = z.object({
  name: z
    .string()
    .min(1, 'File name is required')
    .max(255, 'File name cannot exceed 255 characters')
    .regex(/^[^/\\:*?"<>|]+$/, 'File name contains invalid characters'),
});

export const moveFileSchema = z.object({
  folderId: z.string().nullable(),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type RenameFileInput = z.infer<typeof renameFileSchema>;
export type MoveFileInput = z.infer<typeof moveFileSchema>;
