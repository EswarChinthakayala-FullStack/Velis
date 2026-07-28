import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ViewIcon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface MarkdownImageProps {
  src?: string;
  alt?: string;
}

/**
 * Detect if an image URL is a badge/shield (shields.io, badge generators, etc.)
 */
function isBadgeImage(src: string, alt?: string): boolean {
  const badgeDomains = [
    'shields.io',
    'badgen.net',
    'badge.fury.io',
    'img.shields.io',
    'badge.svg',
    'github.com/workflows',
    'codecov.io',
    'coveralls.io',
    'snyk.io',
    'david-dm.org',
    'travis-ci.org',
    'circleci.com',
  ];

  const isBadgeUrl = badgeDomains.some((domain) => src.includes(domain));
  const hasBadgeExtension = src.endsWith('.svg') && (src.includes('badge') || src.includes('shield'));
  const altSuggestsBadge = alt ? /^(license|version|build|coverage|npm|downloads|status|ci|cd)/i.test(alt) : false;

  return isBadgeUrl || hasBadgeExtension || altSuggestsBadge;
}

export const MarkdownImage: React.FC<MarkdownImageProps> = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) return null;

  // Badge/shield images — render inline without decoration
  if (isBadgeImage(src, alt)) {
    return (
      <img
        src={src}
        alt={alt || 'Badge'}
        loading="lazy"
        className="inline-block h-5 object-contain"
      />
    );
  }

  return (
    <>
      <span className="block my-4 relative group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/50 inline-block cursor-pointer">
        <img
          src={src}
          alt={alt || 'Documentation Asset'}
          loading="lazy"
          onClick={() => setIsOpen(true)}
          className="max-w-full h-auto rounded-lg transition-transform duration-200 group-hover:scale-[1.01]"
        />

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="absolute top-2 right-2 p-1.5 rounded bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
          title="Zoom image"
        >
          <HugeiconsIcon icon={ViewIcon} size={14} />
        </button>

        {alt && (
          <span className="block p-2 text-center text-[11px] font-mono text-zinc-400 border-t border-zinc-800/80 bg-zinc-950">
            {alt}
          </span>
        )}
      </span>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
          <img
            src={src}
            alt={alt || 'Enlarged View'}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
};

export default MarkdownImage;
