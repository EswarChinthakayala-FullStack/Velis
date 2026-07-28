import React, { useState } from 'react';

interface FolderRenameInputProps {
  initialName: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
}

export const FolderRenameInput: React.FC<FolderRenameInputProps> = ({
  initialName,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialName);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (name.trim()) onSave(name.trim());
      else onCancel();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <input
      type="text"
      autoFocus
      value={name}
      onChange={(e) => setName(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => {
        if (name.trim() && name.trim() !== initialName) {
          onSave(name.trim());
        } else {
          onCancel();
        }
      }}
      className="h-6 px-1.5 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono text-white outline-none w-full max-w-[160px]"
    />
  );
};

export default FolderRenameInput;
