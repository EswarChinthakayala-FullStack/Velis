import {
  FileCodeIcon,
  Image01Icon,
  Video01Icon,
  File01Icon,
  Folder01Icon,
  ArchiveIcon,
  DocumentCodeIcon,
  Pdf01Icon,
  HeadphonesIcon,
} from '@hugeicons/core-free-icons';
import { getCategoryFromMimeOrExt } from './mime-utils';
import type { FileCategory } from '../types/file';

/**
 * Returns the appropriate HugeIcon component for a file category or filename.
 */
export function getFileCategoryIcon(categoryOrMime?: string, fileName?: string) {
  const category: FileCategory =
    (categoryOrMime as FileCategory) in { all: 1, image: 1, video: 1, audio: 1, pdf: 1, document: 1, code: 1, archive: 1, other: 1 }
      ? (categoryOrMime as FileCategory)
      : getCategoryFromMimeOrExt(categoryOrMime, fileName);

  switch (category) {
    case 'image':
      return Image01Icon;
    case 'video':
      return Video01Icon;
    case 'audio':
      return HeadphonesIcon;
    case 'pdf':
      return Pdf01Icon;
    case 'code':
      return FileCodeIcon;
    case 'archive':
      return ArchiveIcon;
    case 'document':
      return DocumentCodeIcon;
    default:
      return File01Icon;
  }
}

export { Folder01Icon };
