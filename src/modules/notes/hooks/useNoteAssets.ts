import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { NoteAttachment } from '../types/note';

export function useNoteAssets() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadAsset = async (file: File): Promise<NoteAttachment> => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `private_notes/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('project-assets')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from('project-assets').getPublicUrl(data.path);

      return {
        id: String(Date.now()),
        name: file.name,
        url: urlData.publicUrl,
        size: file.size,
        mimeType: file.type,
      };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAsset,
    isUploading,
  };
}
