import React from 'react';
import type { ProjectItem } from '../../../types/project';
import { ProjectCard } from './ProjectCard';

interface ProjectsGridProps {
  projects: ProjectItem[];
  onEdit?: (project: ProjectItem) => void;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, onEdit }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default ProjectsGrid;
