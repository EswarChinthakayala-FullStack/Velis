import React, { useState, useMemo } from 'react';
import hljs from 'highlight.js';
import { HugeiconsIcon } from '@hugeicons/react';
import { Copy01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { extractTextFromNode } from './MarkdownRenderer';
import { toast } from '../../../components/ui/toast';

interface MarkdownCodeBlockProps {
  language?: string;
  code: any;
}

export const MarkdownCodeBlock: React.FC<MarkdownCodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);
  const [isWrapped, setIsWrapped] = useState(false);

  const rawString = typeof code === 'string' ? code : extractTextFromNode(code);

  // Syntax highlight using highlight.js
  const highlighted = useMemo(() => {
    const trimmed = (rawString || '').replace(/\n$/, '');
    if (!trimmed) return { lines: [''], lang: language || 'text' };

    try {
      const validLang = language && language !== 'text' && hljs.getLanguage(language);
      const result = validLang
        ? hljs.highlight(trimmed, { language })
        : hljs.highlightAuto(trimmed);

      // Split highlighted HTML by newlines, preserving span tags across lines
      const htmlLines = splitHighlightedLines(result.value);

      return {
        lines: htmlLines,
        lang: validLang ? language : (result.language || language || 'text'),
      };
    } catch {
      return {
        lines: trimmed.split('\n'),
        lang: language || 'text',
      };
    }
  }, [rawString, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawString);
    setCopied(true);
    toast.success('Code snippet copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg bg-[#0c0c0e] border border-zinc-800/80 overflow-hidden font-mono shadow-lg group select-text">
      {/* Header bar */}
      <div className="px-4 py-2 bg-zinc-900/80 border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 select-none">
        <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-300">
          {highlighted.lang || 'text'}
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsWrapped(!isWrapped)}
            className="text-[10px] hover:text-white transition-colors cursor-pointer"
          >
            {isWrapped ? 'Unwrap' : 'Wrap'}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? (
              <>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} className="text-emerald-400" />
                <span className="text-emerald-400 text-[10px]">Copied</span>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Copy01Icon} size={12} />
                <span className="text-[10px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code body with syntax highlighting and line numbers */}
      <div className={`p-4 text-xs font-mono overflow-x-auto ${isWrapped ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}>
        <table className="w-full border-collapse">
          <tbody>
            {highlighted.lines.map((line, index) => (
              <tr key={index} className="hover:bg-zinc-900/40">
                <td className="pr-4 text-right text-zinc-600 select-none w-8 text-[11px] font-mono align-top">
                  {index + 1}
                </td>
                <td
                  className="text-zinc-200 align-top font-mono leading-relaxed select-text hljs"
                  dangerouslySetInnerHTML={{ __html: line || ' ' }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Splits highlight.js HTML output into individual lines while preserving
 * open span tags across line boundaries. This ensures each line is valid HTML.
 */
function splitHighlightedLines(html: string): string[] {
  const lines = html.split('\n');
  const result: string[] = [];
  let openTags: string[] = [];

  for (const line of lines) {
    // Prepend any open tags from previous line
    let prefixed = openTags.join('') + line;

    // Track open/close spans in this line
    const openMatches = line.match(/<span[^>]*>/g) || [];
    const closeMatches = line.match(/<\/span>/g) || [];

    // Update the open tags stack
    for (const tag of openMatches) {
      openTags.push(tag);
    }
    for (let i = 0; i < closeMatches.length; i++) {
      openTags.pop();
    }

    // Close any still-open tags at end of this line
    const closeSuffix = '</span>'.repeat(openTags.length);

    result.push(prefixed + closeSuffix);
  }

  return result;
}

export default MarkdownCodeBlock;
