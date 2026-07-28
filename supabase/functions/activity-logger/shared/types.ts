/**
 * Supabase Database Webhook & Activity Log Types (Deno Edge Function)
 */

export type WebhookEventType = 'INSERT' | 'UPDATE' | 'DELETE';

export interface WebhookPayload<T = Record<string, any>> {
  type: WebhookEventType;
  table: string;
  schema: string;
  record: T | null;
  old_record: T | null;
  timestamp?: string;
}

export interface ActivityLogInsert {
  actor_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  metadata: Record<string, any>;
  created_at?: string;
}

export interface DomainHandlerResult {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata: Record<string, any>;
}
