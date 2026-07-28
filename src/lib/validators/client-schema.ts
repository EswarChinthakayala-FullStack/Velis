import { z } from 'zod';

/**
 * Enterprise Client Validation Schemas
 * Authoritative validation definitions matching Supabase `public.clients` table constraints.
 */

// Reusable URL validator allowing empty strings
const optionalUrlSchema = z
  .string()
  .trim()
  .url('Website URL is invalid (e.g. https://example.com)')
  .or(z.literal(''))
  .optional();

export const socialLinksSchema = z
  .object({
    linkedin: optionalUrlSchema,
    twitter: optionalUrlSchema,
    github: optionalUrlSchema,
    portfolio: optionalUrlSchema,
    behance: optionalUrlSchema,
    dribbble: optionalUrlSchema,
    other: optionalUrlSchema,
  })
  .optional();

export const createClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Client name is required (minimum 2 characters)')
    .max(100, 'Client name must not exceed 100 characters'),
  company: z
    .string()
    .trim()
    .max(100, 'Company name must not exceed 100 characters')
    .optional(),
  email: z
    .string()
    .trim()
    .lowercase()
    .email('Please enter a valid email address.')
    .or(z.literal(''))
    .optional(),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone number is too long')
    .optional(),
  country: z
    .string()
    .trim()
    .optional(),
  timezone: z
    .string()
    .trim()
    .optional(),
  website: optionalUrlSchema,
  githubUsername: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9-]*$/, 'Invalid GitHub username (only letters, numbers, and hyphens allowed)')
    .max(39, 'GitHub username must not exceed 39 characters')
    .optional(),
  socialLinks: socialLinksSchema,
  notes: z
    .string()
    .trim()
    .max(5000, 'Notes must not exceed 5000 characters')
    .optional(),
  tags: z
    .array(z.string().trim())
    .refine((tags) => new Set(tags).size === tags.length, {
      message: 'Duplicate tags are not allowed.',
    })
    .optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const clientSchema = createClientSchema.extend({
  id: z.string().uuid(),
  status: z.enum(['active', 'inactive']),
  activeProjectsCount: z.number().int().min(0),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof createClientSchema>;
export type UpdateClientFormValues = z.infer<typeof updateClientSchema>;
export type ClientSchemaValues = z.infer<typeof clientSchema>;
