import { z } from 'zod';

export interface TimelineUpdateFormValues {
  title: string;
  description: string;
  entryDate: string;
  updateType:
    | 'feature'
    | 'bug_fix'
    | 'deployment'
    | 'milestone'
    | 'documentation'
    | 'database'
    | 'backend'
    | 'frontend'
    | 'design'
    | 'general';
  visibility: 'public' | 'private';
  tags: string[];
  attachments: {
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType?: string;
    sizeBytes?: number;
  }[];
}

export const timelineUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'Update title is required.')
    .max(120, 'Title cannot exceed 120 characters.'),
  description: z
    .string()
    .max(20000, 'Description cannot exceed 20,000 characters.'),
  entryDate: z
    .string()
    .min(1, 'Entry date is required.'),
  updateType: z.enum([
    'feature',
    'bug_fix',
    'deployment',
    'milestone',
    'documentation',
    'database',
    'backend',
    'frontend',
    'design',
    'general',
  ]),
  visibility: z.enum(['public', 'private']),
  tags: z.array(z.string()),
  attachments: z.array(
    z.object({
      id: z.string(),
      fileName: z.string(),
      fileUrl: z.string(),
      mimeType: z.string().optional(),
      sizeBytes: z.number().optional(),
    })
  ),
});
