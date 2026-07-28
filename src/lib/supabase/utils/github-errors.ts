import { normalizeClientError } from '../../utils/client-errors';

export function handleGitHubError(err: unknown, fallbackMessage = 'GitHub operation failed.'): Error {
  if (err instanceof Error) {
    return err;
  }
  const normalized = normalizeClientError(err);
  return new Error(normalized.message || fallbackMessage);
}
