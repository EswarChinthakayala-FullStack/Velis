import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Sun01Icon, Moon01Icon } from '@hugeicons/core-free-icons';
import { useLayoutStore } from '../../../stores/useLayoutStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useLayoutStore();

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700/80 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-sm relative group"
      title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
      aria-label="Toggle application theme"
    >
      <HugeiconsIcon
        icon={theme === 'light' ? Sun01Icon : Moon01Icon}
        size={18}
        className="transition-transform duration-200 group-hover:scale-110"
      />
    </button>
  );
};

export default ThemeToggle;
