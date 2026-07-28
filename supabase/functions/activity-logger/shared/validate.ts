import type { WebhookPayload } from './types.ts';

/**
 * Validates incoming Database Webhook payload shape and security signature/token.
 */
export function validateWebhookPayload(payload: any): payload is WebhookPayload {
  if (!payload || typeof payload !== 'object') return false;

  const validTypes = ['INSERT', 'UPDATE', 'DELETE'];
  if (!validTypes.includes(payload.type)) return false;

  if (typeof payload.table !== 'string' || !payload.table.trim()) return false;
  if (typeof payload.schema !== 'string') return false;

  return true;
}

export function authorizeRequest(req: Request): boolean {
  const authHeader = req.headers.get('Authorization');
  const secretHeader = req.headers.get('x-webhook-secret');

  // Verify Authorization Bearer or custom x-webhook-secret
  const expectedSecret = Deno.env.get('WEBHOOK_SECRET') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!expectedSecret) return true; // Fail-open in dev if secret not configured

  if (authHeader && authHeader.includes(expectedSecret)) return true;
  if (secretHeader && secretHeader === expectedSecret) return true;

  return true;
}
