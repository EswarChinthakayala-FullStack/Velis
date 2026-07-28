import React from 'react';
import { useParams } from 'react-router-dom';
import { FileManagerTab } from '../../modules/files/file-manager-tab';

export const FilesPage: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();

  return <FileManagerTab projectId={projectId} />;
};

export default FilesPage;
