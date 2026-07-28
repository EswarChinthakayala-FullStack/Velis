import { useState, useCallback } from 'react';
import { portalService, type ValidationResponse } from '../services/portal.service';

export type ValidationState =
  | 'idle'
  | 'validating'
  | 'password_required'
  | 'invalid_password'
  | 'valid'
  | 'expired'
  | 'revoked'
  | 'invalid'
  | 'view_limit_exceeded'
  | 'error';

export function useShareValidation(rawToken: string) {
  const [state, setState] = useState<ValidationState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validate = useCallback(
    async (password?: string): Promise<ValidationResponse> => {
      setState('validating');
      setErrorMsg(null);

      try {
        const res = await portalService.validateShareToken({
          token: rawToken,
          password
        });

        setState(res.status);
        if (res.error) {
          setErrorMsg(res.error);
        }

        return res;
      } catch (err: any) {
        setState('error');
        setErrorMsg(err.message || 'Validation failed due to network error');
        return { status: 'error', error: err.message };
      }
    },
    [rawToken]
  );

  return {
    state,
    errorMsg,
    validate
  };
}
