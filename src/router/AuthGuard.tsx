import React from 'react';
import { AuthGuard as EnterpriseAuthGuard } from '../modules/auth/auth-guard';

interface AuthGuardProps {
  children: React.ReactNode;
  onUnauthorized?: () => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  return <EnterpriseAuthGuard>{children}</EnterpriseAuthGuard>;
};

export default AuthGuard;
