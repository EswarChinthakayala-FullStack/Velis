import { z } from 'zod';

export const uploadScreenshotSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z.string().optional(),
  milestoneId: z.string().nullable().optional(),
  moduleName: z.string().optional(),
  takenAt: z.string().optional(),
});

export const updateScreenshotSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(120),
  description: z.string().optional(),
  milestoneId: z.string().nullable().optional(),
  moduleName: z.string().optional(),
});

export type UploadScreenshotInput = z.infer<typeof uploadScreenshotSchema>;
export type UpdateScreenshotInput = z.infer<typeof updateScreenshotSchema>;
