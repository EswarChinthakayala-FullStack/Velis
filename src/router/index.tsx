import React from 'react';
import { AuthProvider } from '../modules/auth/auth-provider';
import { AppRouter as EnterpriseAppRouter } from '../app/router';

export const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <EnterpriseAppRouter />
    </AuthProvider>
  );
};

export default AppRouter;
