import React from 'react';
import { useParams } from 'react-router-dom';
import { ProjectsListPage } from '../../modules/projects/projects-list-page';
import { ProjectDetailLayout } from '../../modules/projects/project-detail-layout';

export const ProjectsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (projectId) {
    return <ProjectDetailLayout />;
  }

  return <ProjectsListPage />;
};

export default ProjectsPage;
