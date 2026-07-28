import { useMutation } from '@tanstack/react-query';
import { uploadProjectThumbnail, type UploadResult } from '../../../lib/supabase/storage/project-thumbnails';

export function useUploadThumbnail() {
  return useMutation<UploadResult, Error, File>({
    mutationFn: (file) => uploadProjectThumbnail(file),
  });
}

export default useUploadThumbnail;
