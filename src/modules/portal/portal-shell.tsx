import React, { useEffect, useState } from 'react';
import { useValidateShareToken } from './hooks/useValidateShareToken';
import { usePortalSession } from './hooks/usePortalSession';
import { PortalAuthProvider } from './providers/PortalAuthProvider';
import { PortalLoading } from './components/PortalLoading';
import { PortalError } from './components/PortalError';
import { PortalPasswordGate } from './portal-password-gate';
import { PortalContentView } from './components/PortalContentView';

export interface PortalShellProps {
  token: string;
}

export const PortalShell: React.FC<PortalShellProps> = ({ token }) => {
  const { state, errorMsg, validate } = useValidateShareToken(token);
  const { viewerJwt, projectId, viewerClient, updateSession, clearSession } = usePortalSession();
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);

  useEffect(() => {
    if (token) {
      validate().then((res) => {
        if (res.success && res.accessToken && res.projectId) {
          updateSession(res.accessToken, res.projectId);
        }
      });
    }
    return () => {
      clearSession();
    };
  }, [token, validate, updateSession, clearSession]);

  const handlePasswordSubmit = async (password: string) => {
    setIsVerifyingPassword(true);
    try {
      const res = await validate(password);
      if (res.success && res.accessToken && res.projectId) {
        updateSession(res.accessToken, res.projectId);
      }
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  if (state === 'validating' || state === 'idle') {
    return <PortalLoading />;
  }

  if (state === 'password_required' || state === 'invalid_password') {
    return (
      <PortalPasswordGate
        token={token}
        onSubmitPassword={handlePasswordSubmit}
        error={errorMsg}
        isLoading={isVerifyingPassword}
      />
    );
  }

  if (state === 'expired' || state === 'disabled' || state === 'revoked' || state === 'invalid' || state === 'view_limit_exceeded' || state === 'error') {
    return <PortalError state={state} message={errorMsg} />;
  }

  if (state === 'valid' && viewerJwt && viewerClient && projectId) {
    return (
      <PortalAuthProvider
        viewerJwt={viewerJwt}
        projectId={projectId}
        viewerClient={viewerClient}
        onClearSession={clearSession}
      >
        <PortalContentView />
      </PortalAuthProvider>
    );
  }

  return <PortalError state="invalid" message="Unable to initialize secure client portal" />;
};

export default PortalShell;
