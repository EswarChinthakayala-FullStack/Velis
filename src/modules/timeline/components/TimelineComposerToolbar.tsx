import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  TextBoldIcon,
  TextItalicIcon,
  CodeCircleIcon,
  Link01Icon,
  File01Icon,
  CheckListIcon,
  Grid02Icon,
  QuoteDownIcon,
  Heading01Icon,
} from '@hugeicons/core-free-icons';

interface TimelineComposerToolbarProps {
  onInsertSyntax: (prefix: string, suffix?: string, defaultText?: string) => void;
}

export const TimelineComposerToolbar: React.FC<TimelineComposerToolbarProps> = ({ onInsertSyntax }) => {
  const TOOLS = [
    { label: 'Bold', prefix: '**', suffix: '**', defaultText: 'bold text', icon: TextBoldIcon },
    { label: 'Italic', prefix: '*', suffix: '*', defaultText: 'italic text', icon: TextItalicIcon },
    { label: 'Heading', prefix: '### ', suffix: '', defaultText: 'Heading 3', icon: Heading01Icon },
    { label: 'Code', prefix: '`', suffix: '`', defaultText: 'code', icon: CodeCircleIcon },
    { label: 'Link', prefix: '[', suffix: '](https://example.com)', defaultText: 'link text', icon: Link01Icon },
    { label: 'List', prefix: '- ', suffix: '', defaultText: 'List item', icon: File01Icon },
    { label: 'Task', prefix: '- [ ] ', suffix: '', defaultText: 'Task item', icon: CheckListIcon },
    { label: 'Quote', prefix: '> ', suffix: '', defaultText: 'Blockquote text', icon: QuoteDownIcon },
    { label: 'Table', prefix: '\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n', suffix: '', defaultText: '', icon: Grid02Icon },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-sm font-mono text-xs select-none no-scrollbar">
      {TOOLS.map((tool) => (
        <button
          key={tool.label}
          type="button"
          onClick={() => onInsertSyntax(tool.prefix, tool.suffix, tool.defaultText)}
          className="p-1.5 rounded-sm hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          title={tool.label}
        >
          <HugeiconsIcon icon={tool.icon} size={14} />
        </button>
      ))}
    </div>
  );
};

export default TimelineComposerToolbar;
