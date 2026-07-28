import { z } from 'zod';

export const addTechnologySchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  name: z.string().trim().min(1, 'Technology name is required').max(50, 'Name max 50 chars'),
  iconUrl: z.string().url('Invalid icon URL').optional().or(z.literal('')),
});

export type AddTechnologyFormValues = z.infer<typeof addTechnologySchema>;
