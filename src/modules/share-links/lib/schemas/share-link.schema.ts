import { z } from 'zod';

export const generateShareLinkSchema = z.object({
  projectId: z.string().min(1, 'Project selection is required'),
  expirationPreset: z.enum(['never', '1d', '7d', '30d', '90d', 'custom']),
  customExpirationDate: z.string().nullable().optional(),
  hasPassword: z.boolean().default(false),
  password: z.string().optional().nullable(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().nullable(),
}).refine(
  (data) => {
    if (data.expirationPreset === 'custom') {
      return Boolean(data.customExpirationDate && new Date(data.customExpirationDate) > new Date());
    }
    return true;
  },
  {
    message: 'Expiration date must be in the future',
    path: ['customExpirationDate'],
  }
).refine(
  (data) => {
    if (data.hasPassword) {
      return Boolean(data.password && data.password.trim().length >= 6);
    }
    return true;
  },
  {
    message: 'Password must be at least 6 characters',
    path: ['password'],
  }
);

export type GenerateShareLinkFormValues = z.infer<typeof generateShareLinkSchema>;

export const updateShareSettingsSchema = z.object({
  linkId: z.string().min(1),
  expirationPreset: z.enum(['never', '1d', '7d', '30d', '90d', 'custom']).optional(),
  customExpirationDate: z.string().nullable().optional(),
  hasPassword: z.boolean().optional(),
  password: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  notes: z.string().max(500).optional().nullable(),
});

export type UpdateShareSettingsFormValues = z.infer<typeof updateShareSettingsSchema>;
