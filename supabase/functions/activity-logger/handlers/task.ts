import type { WebhookPayload, DomainHandlerResult } from '../shared/types.ts';
import { getChangedFields, mapActionType } from '../shared/normalize.ts';

export function handleTaskWebhook(payload: WebhookPayload): DomainHandlerResult {
  const { type, table, record, old_record } = payload;
  const current = record || old_record || {};
  const isMilestone = table === 'milestones';

  const entityType = isMilestone ? 'milestone' : 'task';
  const entityId = current.id || null;
  const actorId = current.assigned_to || current.created_by || null;
  let action = mapActionType(type);

  // Check if status transitioned to completed
  if (type === 'UPDATE' && current.status === 'completed' && old_record?.status !== 'completed') {
    action = 'completed';
  }

  const changedFields = type === 'UPDATE' ? getChangedFields(record, old_record) : [];

  const metadata: Record<string, any> = {
    title: current.title || current.name,
    project_id: current.project_id,
    status: current.status,
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
