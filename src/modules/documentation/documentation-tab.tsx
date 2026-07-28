import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDocuments } from './hooks/useDocuments';
import { useProjects } from '../projects/hooks/useProjects';
import {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
} from '../../lib/supabase/queries/documentation';
import type { DocumentItem } from './lib/types/documentation';

import { DocumentationToolbar, type ProjectOption } from './components/DocumentationToolbar';
import { DocumentationSidebar } from './components/DocumentationSidebar';
import { DocumentationViewer } from './components/DocumentationViewer';
import { DocumentEmptyState } from './components/DocumentEmptyState';
import { DocumentSkeleton } from './components/DocumentSkeleton';
import { CreateDocumentModal } from './components/CreateDocumentModal';
import { MarkdownTOC } from './components/MarkdownTOC';
import { useSearchDocuments } from './hooks/useSearchDocuments';
import { extractTocHeadings } from './lib/utils/markdown/toc-generator';
import { ConfirmDeleteDialog } from '../../components/ui/confirm-delete-dialog';

interface DocumentationTabProps {
  projectId?: string;
  readOnly?: boolean;
  className?: string;
}

export const DocumentationTab: React.FC<DocumentationTabProps> = ({
  projectId,
  readOnly = false,
  className = '',
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || 'all');
  const { data: projectsResult } = useProjects();
  
  const activeProjectId = projectId || (selectedProjectId === 'all' ? undefined : selectedProjectId);
  const { data: documents = [], isLoading } = useDocuments(activeProjectId, readOnly);
  const centerScrollRef = useRef<HTMLDivElement>(null);

  const projectsOptions: ProjectOption[] = useMemo(() => {
    const rawProjects = (projectsResult as any)?.projects || (projectsResult as any)?.data || (Array.isArray(projectsResult) ? projectsResult : []);
    return rawProjects.map((p: any) => ({
      id: p.id,
      name: p.name || p.title || 'Untitled Project',
    }));
  }, [projectsResult]);

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<DocumentItem | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredDocuments,
  } = useSearchDocuments(documents);

  // Mutations
  const createMutation = useCreateDocument();
  const updateMutation = useUpdateDocument(projectId);
  const deleteMutation = useDeleteDocument(projectId);

  // Automatically select the first document if none selected
  useEffect(() => {
    if (documents.length > 0 && !selectedDocumentId) {
      setSelectedDocumentId(documents[0].id);
    }
  }, [documents, selectedDocumentId]);

  const activeDocument = useMemo(() => {
    return documents.find((d) => d.id === selectedDocumentId) || filteredDocuments[0] || documents[0];
  }, [documents, filteredDocuments, selectedDocumentId]);

  // Extract TOC headings from active document
  const tocHeadings = useMemo(() => {
    if (!activeDocument?.content) return [];
    return extractTocHeadings(activeDocument.content);
  }, [activeDocument?.content]);

  const handleCreateDocument = (data: any) => {
    createMutation.mutate(
      {
        projectId: projectId || activeDocument?.projectId || 'default-project',
        ...data,
      },
      {
        onSuccess: (newDoc: DocumentItem) => {
          setSelectedDocumentId(newDoc.id);
          setIsCreateModalOpen(false);
        },
      }
    );
  };

  const handleUpdateDocument = (data: any) => {
    if (!documentToEdit) return;
    updateMutation.mutate(
      {
        id: documentToEdit.id,
        input: data,
      },
      {
        onSuccess: (updated: DocumentItem) => {
          setSelectedDocumentId(updated.id);
          setDocumentToEdit(null);
        },
      }
    );
  };

  const handleDeleteDocument = () => {
    if (!activeDocument || readOnly) return;
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteDocument = () => {
    if (!activeDocument) return;
    deleteMutation.mutate(activeDocument.id, {
      onSuccess: () => {
        const remaining = documents.filter((d) => d.id !== activeDocument.id);
        setSelectedDocumentId(remaining[0]?.id);
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const handleExportMarkdown = () => {
    if (!activeDocument) return;
    const blob = new Blob([activeDocument.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeDocument.slug || 'document'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const hasDocuments = !isLoading && documents.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex flex-col text-zinc-100 font-sans select-none overflow-hidden -mx-4 -mt-4 -mb-16 sm:-mx-6 sm:-mt-6 h-[calc(100vh-3.5rem)] ${className}`}
    >
      {/* ─── Sticky Toolbar ─── fixed below top navbar */}
      <div className="shrink-0 z-10 px-3 sm:px-4 pt-2 sm:pt-3 pb-2">
        <DocumentationToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          readOnly={readOnly}
          documents={filteredDocuments}
          selectedDocumentId={activeDocument?.id}
          onSelectDocument={(doc) => setSelectedDocumentId(doc.id)}
          projects={readOnly || projectId ? [] : projectsOptions}
          selectedProjectId={projectId || selectedProjectId}
          onSelectProject={readOnly || projectId ? undefined : (projId) => {
            setSelectedProjectId(projId);
            setSelectedDocumentId(undefined);
          }}
          onOpenCreateModal={() => {
            setDocumentToEdit(null);
            setIsCreateModalOpen(true);
          }}
          onOpenEditModal={() => {
            if (activeDocument) {
              setDocumentToEdit(activeDocument);
            }
          }}
          onDeleteDocument={activeDocument ? handleDeleteDocument : undefined}
          onExportMarkdown={activeDocument ? handleExportMarkdown : undefined}
        />
      </div>

      {/* ─── Main 3-Column Layout ─── all panels fixed, only center scrolls */}
      {isLoading ? (
        <div className="flex-1 overflow-hidden px-4 pb-4">
          <DocumentSkeleton />
        </div>
      ) : documents.length === 0 ? (
        <div className="flex-1 overflow-auto px-4 pb-4">
          <DocumentEmptyState
            readOnly={readOnly}
            onCreateDocument={() => {
              setDocumentToEdit(null);
              setIsCreateModalOpen(true);
            }}
          />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* ─── Left Sidebar ─── fixed panel, only internal list scrolls */}
          <DocumentationSidebar
            documents={filteredDocuments}
            selectedDocumentId={activeDocument?.id}
            onSelectDocument={(doc) => setSelectedDocumentId(doc.id)}
            readOnly={readOnly}
          />

          {/* ─── Center Content ─── the ONLY scrollable area */}
          <div
            ref={centerScrollRef}
            className="flex-1 min-w-0 overflow-y-auto custom-scrollbar px-3 sm:px-6 py-4"
          >
            {activeDocument ? (
              <DocumentationViewer document={activeDocument} />
            ) : (
              <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                Select a document from the index to view specifications.
              </div>
            )}
          </div>

          {/* ─── Right TOC Sidebar ─── fixed panel, only internal list scrolls */}
          {hasDocuments && tocHeadings.length > 0 && (
            <MarkdownTOC
              headings={tocHeadings}
              scrollContainerRef={centerScrollRef}
            />
          )}
        </div>
      )}

      {/* Modal for Creating & Editing Documents */}
      {(isCreateModalOpen || Boolean(documentToEdit)) && (
        <CreateDocumentModal
          isOpen={isCreateModalOpen || Boolean(documentToEdit)}
          onClose={() => {
            setIsCreateModalOpen(false);
            setDocumentToEdit(null);
          }}
          documentToEdit={documentToEdit}
          onSubmit={documentToEdit ? handleUpdateDocument : handleCreateDocument}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteDocument}
        title="Delete Document"
        description={`Are you sure you want to delete "${activeDocument?.title || 'this document'}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </motion.div>
  );
};

export default DocumentationTab;
