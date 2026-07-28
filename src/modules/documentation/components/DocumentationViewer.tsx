import React from 'react';
import type { DocumentItem } from '../lib/types/documentation';
import { MarkdownRenderer } from './MarkdownRenderer';
import { DocumentMetadata } from './DocumentMetadata';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../../components/ui/breadcrumb';

interface DocumentationViewerProps {
  document: DocumentItem;
}

export const DocumentationViewer: React.FC<DocumentationViewerProps> = ({ document: doc }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList className="text-xs font-mono text-zinc-400">
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="hover:text-white transition-colors">
              Docs
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-zinc-600" />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="hover:text-white transition-colors">
              {doc.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-zinc-600" />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-white truncate max-w-[200px]">
              {doc.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Document Title Header */}
      <div className="space-y-1 pb-3 border-b border-zinc-800/80">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
          {doc.title}
        </h1>
      </div>

      {/* Document Metadata Bar */}
      <DocumentMetadata document={doc} />

      {/* GitHub-Class Markdown Renderer Body */}
      <div className="pt-2 pb-16">
        <MarkdownRenderer content={doc.content} />
      </div>
    </div>
  );
};

export default DocumentationViewer;
