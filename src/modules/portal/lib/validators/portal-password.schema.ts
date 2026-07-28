import { z } from 'zod';

export const portalPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export type PortalPasswordFormValues = z.infer<typeof portalPasswordSchema>;
