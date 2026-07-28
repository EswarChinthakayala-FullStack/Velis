import { z } from 'zod';

export const documentCategoryEnum = z.enum([
  'Technical',
  'API',
  'Deployment',
  'Database',
  'User Guide',
  'Internal',
  'Client Visible',
]);

export const documentStatusEnum = z.enum(['draft', 'review', 'approved', 'archived']);

export const documentSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters.')
    .max(120, 'Title cannot exceed 120 characters.'),
  content: z.string().min(1, 'Document content cannot be empty.'),
  category: documentCategoryEnum.default('Technical'),
  status: documentStatusEnum.default('approved'),
  version: z.string().default('1.0.0'),
  author: z.string().optional(),
  isClientVisible: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
});

export type DocumentFormData = z.infer<typeof documentSchema>;
