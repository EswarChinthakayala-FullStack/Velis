import { z } from 'zod';

export const noteFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(150, 'Title cannot exceed 150 characters')
    .transform((v) => v.trim()),
  content: z.string().min(1, 'Note content is required'),
  category: z.enum([
    'general',
    'meeting',
    'client_pref',
    'ideas',
    'bugs',
    'improvements',
    'architecture',
    'deployment',
    'credentials',
    'followup',
    'internal_tasks',
    'research',
  ]),
  projectId: z.string().optional().or(z.literal('')),
  clientId: z.string().optional().or(z.literal('')),
  isPinned: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  attachments: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
        size: z.number().optional(),
        mimeType: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;
