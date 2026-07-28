import { z } from 'zod';

export const updateProjectSectionSchema = z.object({
  name: z.string().trim().min(1, 'Section name is required').max(100).optional(),
  content: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const createProjectSectionSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().trim().min(1, 'Section name is required').max(100),
  content: z.string().default(''),
  sortOrder: z.number().int().default(0),
});

export type UpdateProjectSectionFormValues = z.infer<typeof updateProjectSectionSchema>;
export type CreateProjectSectionFormValues = z.infer<typeof createProjectSectionSchema>;
