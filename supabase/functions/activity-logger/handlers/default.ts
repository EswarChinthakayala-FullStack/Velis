import type { WebhookPayload, DomainHandlerResult } from '../shared/types.ts';
import { getChangedFields, mapActionType } from '../shared/normalize.ts';

export function handleDefaultWebhook(payload: WebhookPayload): DomainHandlerResult {
  const { type, table, record, old_record } = payload;
  const current = record || old_record || {};

  const entityType = table.replace(/s$/, '').replace(/_entries$/, '');
  const entityId = current.id || null;
  const actorId = current.created_by || current.uploaded_by || null;
  const action = mapActionType(type);

  const changedFields = type === 'UPDATE' ? getChangedFields(record, old_record) : [];

  const metadata: Record<string, any> = {
    name: current.name || current.title || current.file_name || current.repo_url,
    project_id: current.project_id,
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
