import React from 'react';
import { MarkdownRenderer } from '../../documentation/components/MarkdownRenderer';

interface ReleaseMarkdownProps {
  content?: string;
  className?: string;
}

export const ReleaseMarkdown: React.FC<ReleaseMarkdownProps> = ({ content, className = '' }) => {
  if (!content || !content.trim()) {
    return (
      <div className="text-xs text-zinc-500 italic font-mono py-2">
        No detailed release notes provided for this version.
      </div>
    );
  }

  return (
    <div className={`space-y-3 font-sans text-xs text-zinc-300 leading-relaxed ${className}`}>
      <MarkdownRenderer content={content} />
    </div>
  );
};
