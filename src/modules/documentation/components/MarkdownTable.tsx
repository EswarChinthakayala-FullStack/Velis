import React from 'react';

interface MarkdownTableProps {
  children: React.ReactNode;
}

export const MarkdownTable: React.FC<MarkdownTableProps> = ({ children }) => {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950/60 shadow-sm font-mono text-xs">
      <table className="w-full text-left border-collapse border-spacing-0">
        {children}
      </table>
    </div>
  );
};

export default MarkdownTable;
