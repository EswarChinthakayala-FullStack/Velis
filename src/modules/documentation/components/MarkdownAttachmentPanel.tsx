import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Attachment01Icon, Upload01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';

interface MarkdownAttachmentPanelProps {
  onInsertMarkdown: (snippet: string) => void;
}

export const MarkdownAttachmentPanel: React.FC<MarkdownAttachmentPanelProps> = ({
  onInsertMarkdown,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const isImage = file.type.startsWith('image/');
      const snippet = isImage
        ? `\n![${file.name}](${dataUrl})\n`
        : `\n[${file.name}](${dataUrl})\n`;

      onInsertMarkdown(snippet);
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <label className="h-8 px-2.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer select-none">
      <HugeiconsIcon icon={isUploading ? Upload01Icon : Attachment01Icon} size={13} className={isUploading ? 'animate-bounce' : ''} />
      <span className="hidden sm:inline">{isUploading ? 'Uploading...' : 'Attach File'}</span>
      <input
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.json,.sql,.md,.zip"
      />
    </label>
  );
};

export default MarkdownAttachmentPanel;
