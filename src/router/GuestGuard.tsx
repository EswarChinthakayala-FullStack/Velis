import React from 'react';

interface GuestGuardProps {
  children: React.ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  return <>{children}</>;
};

export default GuestGuard;
