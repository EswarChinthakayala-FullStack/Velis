import React from 'react';
import { useParams } from 'react-router-dom';
import { DocumentationTab } from '../../modules/documentation/documentation-tab';

export const DocsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();

  return <DocumentationTab projectId={projectId} />;
};

export default DocsPage;
