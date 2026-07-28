import { z } from 'zod';

export const notificationCategorySchema = z.enum([
  'projects',
  'clients',
  'timeline',
  'github',
  'deployments',
  'payments',
  'notes',
  'changelog',
  'share_links',
  'security',
  'authentication',
  'system',
  'storage',
  'backup',
  'settings',
]);

export const notificationTypeSchema = z.enum(['info', 'success', 'warning', 'error']);
export const notificationPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const notificationItemSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().optional(),
  category: notificationCategorySchema,
  type: notificationTypeSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  priority: notificationPrioritySchema,
  readStatus: z.boolean(),
  archived: z.boolean(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  projectId: z.string().optional(),
  clientId: z.string().optional(),
  actorId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string(),
});
