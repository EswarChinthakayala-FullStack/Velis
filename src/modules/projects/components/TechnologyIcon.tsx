import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CodeIcon } from '@hugeicons/core-free-icons';

// Devicon CDN Slugs Mapping (jsdelivr CDN)
const DEVICON_SLUG_MAP: Record<string, string> = {
  react: 'react',
  'react.js': 'react',
  'react native': 'react',
  'next.js': 'nextjs',
  nextjs: 'nextjs',
  python: 'python',
  fastapi: 'fastapi',
  django: 'django',
  flask: 'flask',
  kotlin: 'kotlin',
  android: 'android',
  supabase: 'supabase',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  mysql: 'mysql',
  mongodb: 'mongodb',
  redis: 'redis',
  docker: 'docker',
  kubernetes: 'kubernetes',
  vercel: 'vercel',
  node: 'nodejs',
  'node.js': 'nodejs',
  express: 'express',
  nestjs: 'nestjs',
  typescript: 'typescript',
  javascript: 'javascript',
  'vue.js': 'vuejs',
  vue: 'vuejs',
  angular: 'angularjs',
  svelte: 'svelte',
  astro: 'astro',
  swift: 'swift',
  flutter: 'flutter',
  'tailwind css': 'tailwindcss',
  tailwind: 'tailwindcss',
  graphql: 'graphql',
  prisma: 'prisma',
  java: 'java',
  'c#': 'csharp',
  csharp: 'csharp',
  go: 'go',
  rust: 'rust',
  aws: 'amazonwebservices',
  firebase: 'firebase',
  github: 'github',
  git: 'git',
};

interface TechnologyIconProps {
  name: string;
  iconUrl?: string;
  className?: string;
  size?: number;
}

/**
 * Dynamic Technology Icon Component
 * Loads high quality SVG brand logos from jsDelivr Devicons CDN with graceful fallback.
 */
export const TechnologyIcon: React.FC<TechnologyIconProps> = ({
  name,
  iconUrl,
  className = '',
  size = 16,
}) => {
  const [hasError, setHasError] = useState(false);
  const normalized = (name || '').toLowerCase().trim();

  // If explicit iconUrl is provided, render custom image
  if (iconUrl && !hasError) {
    return (
      <img
        src={iconUrl}
        alt={name}
        className={`object-contain rounded shrink-0 ${className}`}
        style={{ width: size, height: size }}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    );
  }

  // Find Devicon slug
  const matchedSlug =
    DEVICON_SLUG_MAP[normalized] ||
    Object.keys(DEVICON_SLUG_MAP).find((key) => normalized.includes(key));

  if (matchedSlug && !hasError) {
    const slug = DEVICON_SLUG_MAP[matchedSlug] || matchedSlug;
    const cdnUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;

    return (
      <img
        src={cdnUrl}
        alt={name}
        className={`object-contain rounded shrink-0 ${className}`}
        style={{ width: size, height: size }}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    );
  }

  // Symbol Fallback
  if (normalized.includes('react')) {
    return <span style={{ fontSize: size }} className={`select-none shrink-0 ${className}`}>⚛</span>;
  }
  if (normalized.includes('python') || normalized.includes('django') || normalized.includes('fastapi')) {
    return <span style={{ fontSize: size }} className={`select-none shrink-0 ${className}`}>🐍</span>;
  }
  if (normalized.includes('kotlin') || normalized.includes('android')) {
    return <span style={{ fontSize: size }} className={`select-none shrink-0 ${className}`}>📱</span>;
  }
  if (normalized.includes('supabase') || normalized.includes('postgres') || normalized.includes('sql') || normalized.includes('mongo')) {
    return <span style={{ fontSize: size }} className={`select-none shrink-0 ${className}`}>🗄</span>;
  }
  if (normalized.includes('docker') || normalized.includes('kubernetes')) {
    return <span style={{ fontSize: size }} className={`select-none shrink-0 ${className}`}>🐳</span>;
  }
  if (normalized.includes('vercel') || normalized.includes('aws') || normalized.includes('cloud')) {
    return <span style={{ fontSize: size }} className={`select-none shrink-0 ${className}`}>☁</span>;
  }

  return <HugeiconsIcon icon={CodeIcon} size={size} className={`text-zinc-400 shrink-0 ${className}`} />;
};

export default TechnologyIcon;
