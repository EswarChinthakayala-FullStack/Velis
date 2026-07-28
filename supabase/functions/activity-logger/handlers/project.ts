import type { WebhookPayload, DomainHandlerResult } from '../shared/types.ts';
import { getChangedFields, mapActionType } from '../shared/normalize.ts';

export function handleProjectWebhook(payload: WebhookPayload): DomainHandlerResult {
  const { type, table, record, old_record } = payload;
  const current = record || old_record || {};
  const isSection = table === 'project_sections';

  const entityType = isSection ? 'section' : 'project';
  const entityId = current.id || null;
  const actorId = current.created_by || current.updated_by || null;
  let action = mapActionType(type);

  const changedFields = type === 'UPDATE' ? getChangedFields(record, old_record) : [];

  const metadata: Record<string, any> = {
    name: current.name || current.title,
    project_id: current.project_id || current.id,
  };

  if (changedFields.length > 0) {
    metadata.changed_fields = changedFields;
  }

  if (!isSection && current.status) {
    metadata.status = current.status;
  }

  return {
    actorId,
    action,
    entityType,
    entityId,
    metadata,
  };
}
