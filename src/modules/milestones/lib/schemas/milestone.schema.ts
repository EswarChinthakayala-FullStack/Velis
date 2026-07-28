import { z } from 'zod';

export const milestoneFormSchema = z.object({
  name: z.string().min(2, 'Milestone deliverable name must be at least 2 characters.'),
  progress: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  dueDate: z.string().optional(),
  completionDate: z.string().optional(),
});

export type MilestoneFormData = z.infer<typeof milestoneFormSchema>;
