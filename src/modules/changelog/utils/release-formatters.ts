import { formatDistanceToNow, parseISO, format } from 'date-fns';
import type { ReleaseType, ReleaseStatus } from '../types/changelog';

export interface SemanticSection {
  title: string;
  iconName?: string;
  content: string;
}

export function formatReleaseDate(dateString?: string): { absolute: string; relative: string } {
  if (!dateString) {
    return { absolute: 'Unreleased', relative: '' };
  }
  try {
    const parsed = parseISO(dateString);
    return {
      absolute: format(parsed, 'MMMM d, yyyy'),
      relative: formatDistanceToNow(parsed, { addSuffix: true }),
    };
  } catch {
    return { absolute: dateString, relative: '' };
  }
}

export function getReleaseTypeBadge(type: ReleaseType): { label: string; className: string } {
  switch (type) {
    case 'stable':
      return { label: 'Stable', className: 'bg-zinc-800 border-zinc-700 text-zinc-200' };
    case 'hotfix':
      return { label: 'Hotfix', className: 'bg-rose-500/10 border-rose-500/30 text-rose-400' };
    case 'major':
      return { label: 'Major Release', className: 'bg-purple-500/10 border-purple-500/30 text-purple-400' };
    case 'minor':
      return { label: 'Minor Feature', className: 'bg-sky-500/10 border-sky-500/30 text-sky-400' };
    case 'beta':
      return { label: 'Beta', className: 'bg-amber-500/10 border-amber-500/30 text-amber-400' };
    case 'alpha':
      return { label: 'Alpha', className: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' };
    case 'patch':
    default:
      return { label: 'Patch', className: 'bg-zinc-800 border-zinc-700 text-zinc-400' };
  }
}

export function getReleaseStatusBadge(status: ReleaseStatus): { label: string; className: string } {
  switch (status) {
    case 'published':
      return { label: 'Published', className: 'bg-zinc-800 border-zinc-700 text-zinc-200' };
    case 'draft':
      return { label: 'Draft', className: 'bg-zinc-900 border-zinc-800 text-zinc-500' };
    case 'internal':
      return { label: 'Internal Only', className: 'bg-amber-500/10 border-amber-500/20 text-amber-400' };
    case 'archived':
      return { label: 'Archived', className: 'bg-rose-500/10 border-rose-500/20 text-rose-400' };
  }
}

export function parseMarkdownSections(markdown?: string): SemanticSection[] {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const sections: SemanticSection[] = [];
  let currentTitle = '';
  let currentLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('#')) {
      if (currentTitle || currentLines.length > 0) {
        sections.push({
          title: currentTitle || 'Overview',
          content: currentLines.join('\n').trim(),
        });
      }
      currentTitle = line.replace(/^#+\s*/, '').trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentTitle || currentLines.length > 0) {
    sections.push({
      title: currentTitle || 'Overview',
      content: currentLines.join('\n').trim(),
    });
  }

  return sections.filter((s) => s.content.length > 0 || s.title !== 'Overview');
}
