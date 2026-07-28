import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';

import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';

import { MarkdownCallout, type CalloutType } from './MarkdownCallout';
import { MarkdownCodeBlock } from './MarkdownCodeBlock';
import { MarkdownTable } from './MarkdownTable';
import { MarkdownImage } from './MarkdownImage';
import { MermaidDiagram } from '../../projects/components/MermaidDiagram';

import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Safely extracts pure text string from AST nodes / React children array
 */
export function extractTextFromNode(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join('');
  if (React.isValidElement(node) && (node.props as any)?.children) {
    return extractTextFromNode(React.Children.toArray((node.props as any).children));
  }
  if (typeof node === 'object') {
    if (node.children) return extractTextFromNode(node.children);
    if (node.value) return String(node.value);
  }
  return '';
}

/**
 * Preprocesses GitHub-style callouts/alerts in O(N) linear time
 */
function preprocessAlerts(text: string): string {
  if (!text) return '';
  const lines = text.split('\n');
  const output: string[] = [];

  let inAlert = false;
  let currentType: CalloutType = 'NOTE';
  let alertLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|SUCCESS|ERROR)\](?:\s+(.*))?$/i);

    if (match) {
      if (inAlert) {
        output.push(`<div data-callout="${currentType}">${alertLines.join(' ')}</div>\n`);
        alertLines = [];
      }
      inAlert = true;
      currentType = match[1].toUpperCase() as CalloutType;
      if (match[2] && match[2].trim()) {
        alertLines.push(match[2].trim());
      }
    } else if (inAlert && line.startsWith('>')) {
      const body = line.replace(/^>\s?/, '').trim();
      if (body) alertLines.push(body);
    } else {
      if (inAlert) {
        output.push(`<div data-callout="${currentType}">${alertLines.join(' ')}</div>\n`);
        inAlert = false;
        alertLines = [];
      }
      output.push(line);
    }
  }

  if (inAlert) {
    output.push(`<div data-callout="${currentType}">${alertLines.join(' ')}</div>\n`);
  }

  return output.join('\n');
}

/**
 * Merges consecutive markdown image-only lines into a single line
 * so badges/shields render horizontally in one paragraph.
 * Matches: ![alt](url) and [![alt](img)](link)
 */
function preprocessBadges(text: string): string {
  if (!text) return '';
  const lines = text.split('\n');
  const output: string[] = [];

  // Regex for a line that is ONLY a markdown image (possibly wrapped in a link)
  const badgeLineRegex = /^\s*(\[!\[.*?\]\(.*?\)\]\(.*?\)|!\[.*?\]\(.*?\))\s*$/;

  let badgeGroup: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (badgeLineRegex.test(line)) {
      badgeGroup.push(line.trim());
    } else {
      if (badgeGroup.length > 1) {
        // Multiple consecutive badge lines → join into one line
        output.push(badgeGroup.join(' '));
      } else if (badgeGroup.length === 1) {
        output.push(badgeGroup[0]);
      }
      badgeGroup = [];
      output.push(line);
    }
  }

  // Flush remaining badge group
  if (badgeGroup.length > 1) {
    output.push(badgeGroup.join(' '));
  } else if (badgeGroup.length === 1) {
    output.push(badgeGroup[0]);
  }

  return output.join('\n');
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const processedContent = useMemo(() => preprocessAlerts(preprocessBadges(content)), [content]);

  const components: Components = {
    div: ({ node, className, children, ...props }: any) => {
      const calloutType = props['data-callout'] as CalloutType | undefined;
      if (calloutType) {
        return <MarkdownCallout type={calloutType}>{children}</MarkdownCallout>;
      }
      return <div className={className} {...props}>{children}</div>;
    },

    // Handle pre element wrapping code block
    pre: ({ children }: any) => {
      let codeContent = '';
      let language = 'text';

      const codeElement = React.Children.toArray(children).find(
        (child) => React.isValidElement(child) && (child.type === 'code' || Boolean((child.props as any)?.children))
      );

      if (codeElement && React.isValidElement(codeElement)) {
        const codeProps = codeElement.props as Record<string, any>;
        const className = codeProps.className || '';
        const langMatch = className.match(/language-(\w+)/) || className.match(/hljs\s+(\w+)/);
        if (langMatch) language = langMatch[1];
        codeContent = extractTextFromNode(codeProps.children);
      } else {
        codeContent = extractTextFromNode(children);
      }

      if (language === 'mermaid') {
        return <MermaidDiagram code={codeContent.trim()} />;
      }

      return <MarkdownCodeBlock language={language} code={codeContent.replace(/\n$/, '')} />;
    },

    // Inline vs block code
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-200" {...props}>
            {extractTextFromNode(children)}
          </code>
        );
      }
      return <code className={className} {...props}>{children}</code>;
    },

    table: ({ children }: any) => <MarkdownTable>{children}</MarkdownTable>,
    img: ({ src, alt }: any) => <MarkdownImage src={src} alt={alt} />,
    h1: ({ children, id }: any) => (
      <h1 id={id} className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-6 pb-2 mb-3 border-b border-zinc-800/80 font-sans">
        {children}
      </h1>
    ),
    h2: ({ children, id }: any) => (
      <h2 id={id} className="text-lg sm:text-xl font-semibold text-white tracking-tight pt-5 pb-2 mb-2 border-b border-zinc-800/60 font-sans">
        {children}
      </h2>
    ),
    h3: ({ children, id }: any) => (
      <h3 id={id} className="text-base font-semibold text-zinc-100 tracking-tight pt-4 pb-1 mb-2 font-sans">
        {children}
      </h3>
    ),
    p: ({ children }: any) => {
      // Detect if paragraph contains ONLY images (badges/shields) — render inline
      const childArray = React.Children.toArray(children);
      const nonEmptyChildren = childArray.filter(
        (child) => !(typeof child === 'string' && child.trim() === '')
      );
      const allImages = nonEmptyChildren.length > 0 && nonEmptyChildren.every(
        (child) =>
          React.isValidElement(child) &&
          ((child.type as any) === 'img' ||
           (child.type as any) === MarkdownImage ||
           (child.props as any)?.src)
      );

      if (allImages) {
        return (
          <p className="flex flex-wrap items-center gap-2 mb-4 font-sans">
            {children}
          </p>
        );
      }

      return (
        <p className="text-sm leading-relaxed text-zinc-300 mb-4 font-sans font-normal">
          {children}
        </p>
      );
    },
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-300 mb-4 font-sans">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-1.5 text-sm text-zinc-300 mb-4 font-sans">
        {children}
      </ol>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-zinc-700 pl-4 py-1 my-4 italic text-zinc-400 font-sans text-sm bg-zinc-900/30 rounded-r-lg">
        {children}
      </blockquote>
    ),
    a: ({ href, children }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-zinc-200 hover:text-white underline underline-offset-4 decoration-zinc-600 font-semibold"
      >
        {children}
      </a>
    ),
  };

  return (
    <article className="prose prose-invert max-w-none font-sans select-text">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownRenderer;
