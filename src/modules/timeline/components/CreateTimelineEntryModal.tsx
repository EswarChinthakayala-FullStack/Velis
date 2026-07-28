import React from 'react';
import { UpdateComposer } from '../update-composer';

interface CreateTimelineEntryModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTimelineEntryModal: React.FC<CreateTimelineEntryModalProps> = ({
  projectId,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <UpdateComposer
      projectId={projectId}
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onClose}
    />
  );
};

export default CreateTimelineEntryModal;
