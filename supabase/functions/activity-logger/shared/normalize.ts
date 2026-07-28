import type { WebhookPayload } from './types.ts';

/**
 * Calculates modified column names between new record and old record for UPDATE events.
 */
export function getChangedFields(
  record: Record<string, any> | null,
  oldRecord: Record<string, any> | null
): string[] {
  if (!record || !oldRecord) return [];

  const changed: string[] = [];
  const keys = new Set([...Object.keys(record), ...Object.keys(oldRecord)]);

  for (const key of keys) {
    if (key === 'updated_at' || key === 'last_synced_at') continue;
    if (JSON.stringify(record[key]) !== JSON.stringify(oldRecord[key])) {
      changed.push(key);
    }
  }

  return changed;
}

export function mapActionType(type: 'INSERT' | 'UPDATE' | 'DELETE'): string {
  switch (type) {
    case 'INSERT':
      return 'created';
    case 'UPDATE':
      return 'updated';
    case 'DELETE':
      return 'deleted';
    default:
      return 'modified';
  }
}
