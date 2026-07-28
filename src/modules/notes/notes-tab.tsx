import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useNotes,
  useDeleteNote,
  usePinNote,
  useArchiveNote,
} from './lib/supabase/queries/notes';
import { useProjects } from '../projects/hooks/useProjects';
import { useClients } from '../clients/hooks/useClients';
import { useNotesSearch } from './hooks/useNotesSearch';

import { NotesHeader, type OptionItem } from './components/NotesHeader';
import { NoteCard } from './components/NoteCard';
import { EmptyNotesState } from './components/EmptyNotesState';
import { NotesSkeleton } from './components/NotesSkeleton';
import { CreateNoteModal } from './components/CreateNoteModal';
import type { NoteItem } from './types/note';

export interface NotesTabProps {
  projectId?: string;
  clientId?: string;
  readOnly?: boolean;
  className?: string;
}

export const NotesTab: React.FC<NotesTabProps> = ({
  projectId,
  clientId,
  readOnly = false,
  className = '',
}) => {
  // CRITICAL SECURITY BOUNDARY: Notes are STRICTLY PRIVATE to authenticated admins.
  // Must NEVER be accessible to portal users or share link viewers.
  if (readOnly || typeof window !== 'undefined' && window.location.pathname.includes('/share/')) {
    return null;
  }

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || 'all');
  const [selectedClientId, setSelectedClientId] = useState<string>(clientId || 'all');

  const activeProjectId = projectId || (selectedProjectId === 'all' ? undefined : selectedProjectId);
  const activeClientId = clientId || (selectedClientId === 'all' ? undefined : selectedClientId);

  // Queries & Mutations
  const { data: notes = [], isLoading } = useNotes(activeProjectId, activeClientId);
  const deleteMutation = useDeleteNote();
  const pinMutation = usePinNote();
  const archiveMutation = useArchiveNote();

  // Related options
  const { data: projectsResult } = useProjects();
  const { data: clientsResult } = useClients();

  // Search & Filter Hook
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    viewState,
    setViewState,
    filteredNotes,
  } = useNotesSearch(notes);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteItem | null>(null);

  const projectsOptions: OptionItem[] = useMemo(() => {
    const raw =
      (projectsResult as any)?.data ||
      (projectsResult as any)?.projects ||
      (Array.isArray(projectsResult) ? projectsResult : []);

    return raw.map((p: any) => ({
      id: String(p.id),
      name: p.name || p.title || 'Untitled Project',
    }));
  }, [projectsResult]);

  const clientsOptions: OptionItem[] = useMemo(() => {
    const raw =
      (clientsResult as any)?.data ||
      (clientsResult as any)?.clients ||
      (Array.isArray(clientsResult) ? clientsResult : []);

    return raw.map((c: any) => ({
      id: String(c.id),
      name: c.name || c.company || 'Untitled Client',
    }));
  }, [clientsResult]);

  // Project and Client maps for fast lookup
  const projectMap = useMemo(() => {
    const map = new Map<string, string>();
    projectsOptions.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [projectsOptions]);

  const clientMap = useMemo(() => {
    const map = new Map<string, string>();
    clientsOptions.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [clientsOptions]);

  const handleEdit = (note: NoteItem) => {
    setNoteToEdit(note);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setNoteToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleTogglePin = async (id: string, isPinned: boolean) => {
    await pinMutation.mutateAsync({ id, isPinned });
  };

  const handleToggleArchive = async (id: string, isArchived: boolean) => {
    await archiveMutation.mutateAsync({ id, isArchived });
  };

  const isSearchFiltered =
    Boolean(searchQuery.trim()) || selectedCategory !== 'all' || viewState !== 'active';

  return (
    <div className={`space-y-5 font-mono ${className}`}>
      {/* Header with Search & Filters */}
      <NotesHeader
        totalNotes={filteredNotes.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        viewState={viewState}
        onViewStateChange={setViewState}
        onOpenCreateModal={handleCreateNew}
        projects={projectId ? undefined : projectsOptions}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
      />

      {/* Main Feed */}
      {isLoading ? (
        <NotesSkeleton />
      ) : filteredNotes.length === 0 ? (
        <EmptyNotesState
          isSearchFiltered={isSearchFiltered}
          onResetFilters={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setViewState('active');
          }}
          onOpenCreateModal={handleCreateNew}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                projectName={note.projectId ? projectMap.get(note.projectId) : undefined}
                clientName={note.clientId ? clientMap.get(note.clientId) : undefined}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
                onToggleArchive={handleToggleArchive}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create / Edit Note Modal */}
      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNoteToEdit(null);
        }}
        noteToEdit={noteToEdit}
        projectId={activeProjectId}
        clientId={activeClientId}
        projects={projectsOptions}
        clients={clientsOptions}
      />
    </div>
  );
};

export default NotesTab;
