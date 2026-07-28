import React from 'react';
import { useParams } from 'react-router-dom';
import { MilestonesTab } from '../../modules/milestones/milestones-tab';

export const MilestonesPage: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();

  return <MilestonesTab projectId={projectId} />;
};

export default MilestonesPage;
