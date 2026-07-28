import { z } from 'zod';

export const deploymentFormSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  environment: z.enum(['local', 'development', 'qa', 'staging', 'production', 'preview']),
  frontendUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  backendUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  apiUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  adminUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  portalUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  version: z.string().optional().or(z.literal('')),
  branch: z.string().optional().or(z.literal('')),
  commitSha: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'offline', 'maintenance', 'deprecated', 'archived']).default('active'),
  healthStatus: z.enum(['healthy', 'warning', 'offline', 'unknown']).default('healthy'),
  provider: z.enum(['vercel', 'netlify', 'railway', 'render', 'aws', 'fly', 'custom']).default('vercel'),
  notes: z.string().optional().or(z.literal('')),
});

export type DeploymentFormValues = z.infer<typeof deploymentFormSchema>;
