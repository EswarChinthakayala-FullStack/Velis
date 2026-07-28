import React, { useEffect, useState } from 'react';
import { useShareValidation } from '../../hooks/useShareValidation';
import { useViewerSession } from '../../hooks/useViewerSession';
import { ViewerProvider } from '../../providers/ViewerProvider';
import { PasswordDialog } from './PasswordDialog';
import { LinkExpiredPage } from './LinkExpiredPage';
import { AccessRevokedPage } from './AccessRevokedPage';
import { InvalidLinkPage } from './InvalidLinkPage';
import { ViewLimitExceededPage } from './ViewLimitExceededPage';
import { ClientPortalView } from '../views/ClientPortalView';
import { AppLogo } from '../ui/AppLogo';
import { INITIAL_CLIENTS, INITIAL_INVOICES } from '../../data/mockData';

interface PortalShellProps {
  token: string;
}

export const PortalShell: React.FC<PortalShellProps> = ({ token }) => {
  const { state, errorMsg, validate } = useShareValidation(token);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const {
    viewerJwt,
    projectId,
    viewerClient,
    updateSession
  } = useViewerSession({
    rawShareToken: token,
    onSessionExpired: () => validate(),
    onSessionRevoked: () => validate()
  });

  useEffect(() => {
    if (token) {
      validate().then((res) => {
        if (res.status === 'valid' && res.token && res.project_id && res.expires_at) {
          updateSession(res.token, res.project_id, res.expires_at);
        }
      });
    }
  }, [token, validate, updateSession]);

  const handlePasswordSubmit = async (password: string) => {
    setIsVerifyingPassword(true);
    try {
      const res = await validate(password);
      if (res.status === 'valid' && res.token && res.project_id && res.expires_at) {
        updateSession(res.token, res.project_id, res.expires_at);
      }
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  if (state === 'validating' || state === 'idle') {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4">
        <AppLogo size={44} animated />
        <p className="text-xs font-mono text-zinc-400 animate-pulse">
          Validating Share Token...
        </p>
      </div>
    );
  }

  if (state === 'password_required' || state === 'invalid_password') {
    return (
      <PasswordDialog
        onSubmit={handlePasswordSubmit}
        error={errorMsg}
        isLoading={isVerifyingPassword}
      />
    );
  }

  if (state === 'expired') {
    return <LinkExpiredPage />;
  }

  if (state === 'revoked') {
    return <AccessRevokedPage />;
  }

  if (state === 'invalid') {
    return <InvalidLinkPage />;
  }

  if (state === 'view_limit_exceeded') {
    return <ViewLimitExceededPage />;
  }

  if (state === 'valid' && viewerJwt && viewerClient && projectId) {
    return (
      <ViewerProvider
        viewerJwt={viewerJwt}
        projectId={projectId}
        viewerClient={viewerClient}
      >
        <ClientPortalView clients={INITIAL_CLIENTS} invoices={INITIAL_INVOICES} />
      </ViewerProvider>
    );
  }

  return <InvalidLinkPage />;
};
