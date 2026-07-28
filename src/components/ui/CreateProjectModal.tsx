import React, { useState } from 'react';
import { Modal } from './Modal';
import { GlassInput } from './GlassInput';
import { GlassButton } from './GlassButton';
import type { Project } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (newProject: Project) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject
}) => {
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [budget, setBudget] = useState('25000');
  const [dueDate, setDueDate] = useState('2026-09-01');
  const [githubRepo, setGithubRepo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientName) return;

    const techStack = techStackInput
      ? techStackInput.split(',').map((s) => s.trim())
      : ['Next.js', 'TypeScript', 'Tailwind'];

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      clientName,
      description: description || 'New client contract project.',
      techStack,
      status: 'in_progress',
      progress: 5,
      budget: parseFloat(budget) || 25000,
      spent: 0,
      dueDate,
      githubRepo: githubRepo || `velis-agency/${name.toLowerCase().replace(/\s+/g, '-')}`,
      priority: 'high',
      membersCount: 3
    };

    onAddProject(newProject);
    onClose();

    // Reset form
    setName('');
    setClientName('');
    setDescription('');
    setTechStackInput('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Client Project"
      subtitle="Initialize developer repository linkage, budget contract, and client portal."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlassInput
          label="Project Name"
          placeholder="e.g. Orion Data Pipeline"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <GlassInput
          label="Client / Company Name"
          placeholder="e.g. Acme Corp"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[#A1A1AA]">
            Description
          </label>
          <textarea
            className="w-full bg-[rgba(17,17,19,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] text-[#FAFAFA] placeholder-[#71717A] text-sm rounded-[14px] p-3 focus:outline-none focus:border-[rgba(255,255,255,0.18)]"
            rows={3}
            placeholder="Brief scope of work..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <GlassInput
          label="Tech Stack (comma separated)"
          placeholder="Next.js, Rust, GraphQL"
          value={techStackInput}
          onChange={(e) => setTechStackInput(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <GlassInput
            label="Total Budget ($)"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <GlassInput
            label="Target Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <GlassInput
          label="GitHub Repository"
          placeholder="velis-agency/orion-pipeline"
          value={githubRepo}
          onChange={(e) => setGithubRepo(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <GlassButton variant="ghost" type="button" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton variant="primary" type="submit">
            Initialize Project
          </GlassButton>
        </div>
      </form>
    </Modal>
  );
};
