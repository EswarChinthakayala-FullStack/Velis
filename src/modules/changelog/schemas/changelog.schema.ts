import { z } from 'zod';

export const SEMVER_REGEX = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const releaseFormSchema = z.object({
  version: z
    .string()
    .min(1, 'Version tag is required')
    .regex(SEMVER_REGEX, 'Must be a valid Semantic Version (e.g. 1.0.0, v2.4.0, 3.0.0-beta.1)'),
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  summary: z.string().max(250, 'Summary cannot exceed 250 characters').optional(),
  description: z.string().min(1, 'Release notes / description is required'),
  releasedAt: z.string().optional(),
  releaseType: z.enum(['stable', 'beta', 'alpha', 'hotfix', 'major', 'minor', 'patch']),
  status: z.enum(['draft', 'internal', 'published', 'archived']),
  githubReleaseUrl: z.string().optional(),
  environment: z.string().default('production'),
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
    .optional(),
});

export type ReleaseFormValues = z.infer<typeof releaseFormSchema>;
