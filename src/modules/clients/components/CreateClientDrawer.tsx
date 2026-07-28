import React from 'react';
import { ClientFormDrawer } from '../client-form-drawer';

interface CreateClientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateClientDrawer: React.FC<CreateClientDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <ClientFormDrawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      mode="create"
    />
  );
};

export default CreateClientDrawer;
