/**
 * Canvas-based image compression helper for WebP/JPEG formats.
 * Preserves aspect ratio while constraining dimensions and file size.
 */
export async function compressScreenshotImage(
  file: File,
  maxWidth = 2560,
  maxHeight = 1440,
  quality = 0.88
): Promise<File> {
  // Only compress images over 2MB
  if (file.size < 2 * 1024 * 1024 || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        return resolve(file);
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) return resolve(file);

          const compressedFile = new File([blob], file.name, {
            type: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}
