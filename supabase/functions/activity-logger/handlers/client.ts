import type { WebhookPayload, DomainHandlerResult } from '../shared/types.ts';
import { getChangedFields, mapActionType } from '../shared/normalize.ts';

export function handleClientWebhook(payload: WebhookPayload): DomainHandlerResult {
  const { type, record, old_record } = payload;
  const current = record || old_record || {};

  const entityType = 'client';
  const entityId = current.id || null;
  const actorId = current.created_by || null;
  const action = mapActionType(type);

  const changedFields = type === 'UPDATE' ? getChangedFields(record, old_record) : [];

  const metadata: Record<string, any> = {
    name: current.name,
    company: current.company,
    email: current.email,
  };

  if (changedFields.length > 0) {
    metadata.changed_fields = changedFields;
  }

  return {
    actorId,
    action,
    entityType,
    entityId,
    metadata,
  };
}
