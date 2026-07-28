import { z } from 'zod';
import { parseISO, isAfter, isSameDay } from 'date-fns';

export const projectFormBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Project name is required (minimum 2 characters)')
    .max(100, 'Project name must not exceed 100 characters'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must not exceed 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  clientId: z.string().uuid('Invalid client selection').optional().or(z.literal('')),
  description: z.string().trim().max(2000, 'Description is too long').optional(),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled'], {
    message: 'Invalid status selection',
  }),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    message: 'Invalid priority selection',
  }),
  startDate: z.string().optional(),
  deadline: z.string().optional(),
  completionPercent: z
    .number()
    .int()
    .min(0, 'Completion percentage must be at least 0%')
    .max(100, 'Completion percentage cannot exceed 100%'),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format (e.g. #E11D48)')
    .optional()
    .or(z.literal('')),
  thumbnailUrl: z
    .string()
    .url('Invalid thumbnail image URL')
    .optional()
    .or(z.literal('')),
});

export const createProjectSchema = projectFormBaseSchema.refine(
  (data) => {
    if (data.startDate && data.deadline) {
      try {
        const start = parseISO(data.startDate);
        const end = parseISO(data.deadline);
        return isAfter(end, start) || isSameDay(end, start);
      } catch {
        return true;
      }
    }
    return true;
  },
  {
    message: 'Deadline must be on or after the start date',
    path: ['deadline'],
  }
);

export const updateProjectSchema = projectFormBaseSchema.partial();

export type ProjectFormValues = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;
