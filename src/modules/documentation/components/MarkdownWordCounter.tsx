import React, { useMemo } from 'react';

interface MarkdownWordCounterProps {
  content: string;
}

export const MarkdownWordCounter: React.FC<MarkdownWordCounterProps> = ({ content }) => {
  const { words, chars, readTimeMinutes } = useMemo(() => {
    const text = content.trim();
    if (!text) return { words: 0, chars: 0, readTimeMinutes: 0 };

    const wordsArr = text.split(/\s+/).filter(Boolean);
    const wCount = wordsArr.length;
    const cCount = text.length;
    const readTime = Math.max(1, Math.ceil(wCount / 200));

    return { words: wCount, chars: cCount, readTimeMinutes: readTime };
  }, [content]);

  return (
    <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500 select-none">
      <span>{words} words</span>
      <span>{chars} characters</span>
      <span>{readTimeMinutes} min read</span>
    </div>
  );
};

export default MarkdownWordCounter;
