import { z } from 'zod';

export const folderNameSchema = z
  .string()
  .min(1, 'Folder name is required')
  .max(100, 'Folder name cannot exceed 100 characters')
  .regex(/^[^/\\:*?"<>|]+$/, 'Folder name contains invalid characters');

export const createSubfolderSchema = z.object({
  name: folderNameSchema,
  parentId: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
});

export const renameFolderSchema = z.object({
  folderId: z.string().min(1, 'Folder ID is required'),
  name: folderNameSchema,
});

export type CreateSubfolderInput = z.infer<typeof createSubfolderSchema>;
export type RenameFolderInput = z.infer<typeof renameFolderSchema>;
