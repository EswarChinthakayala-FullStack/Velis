import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { ChangelogAttachment } from '../types/changelog';

export function useReleaseAssets() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadAsset = async (file: File, projectId: string): Promise<ChangelogAttachment> => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `changelog/${fileName}`;

      const { data, error } = await supabase.storage
        .from('project-assets')
        .upload(filePath, file, { upsert: true });

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
