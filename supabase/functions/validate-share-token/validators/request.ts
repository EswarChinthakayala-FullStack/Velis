import type { ValidateShareTokenRequest } from '../types.ts';

export function validateTokenRequest(payload: any): { valid: true; value: ValidateShareTokenRequest } | { valid: false; error: string } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Request body must be a valid JSON object' };
  }

  const token = payload.token || payload.share_token;
  if (!token || typeof token !== 'string' || token.trim().length < 8) {
    return { valid: false, error: 'Valid share token is required' };
  }

  const password = payload.password ? String(payload.password).trim() : null;

  return {
    valid: true,
    value: {
      token: token.trim(),
      password,
    },
  };
}
