// src/utils/imageOptimizer.js
// Ultra-fast client-side image optimization & WebP compression for School Website (Logos, Banners, Gallery, Staff)

export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const binary = atob(parts[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: mime });
}

export async function optimizeImage(file, options = {}) {
  const {
    maxWidth = 1400,
    maxHeight = 1000,
    quality = 0.84,
    preferredFormat = 'image/webp'
  } = options;

  if (!file) {
    throw new Error('No file provided');
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Image processing timed out. Please try another photo.'));
    }, 5000);

    let objectUrl = null;
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      objectUrl = null;
    }

    const cleanup = () => {
      clearTimeout(timeoutId);
      if (objectUrl) {
        try { URL.revokeObjectURL(objectUrl); } catch {}
      }
    };

    const processImageElement = (img) => {
      try {
        let width = img.naturalWidth || img.width || 1200;
        let height = img.naturalHeight || img.height || 800;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context unavailable');
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let targetFormat = preferredFormat;
        let dataUrl = canvas.toDataURL(targetFormat, quality);
        if (!dataUrl.startsWith(`data:${targetFormat}`)) {
          targetFormat = 'image/jpeg';
          dataUrl = canvas.toDataURL(targetFormat, quality);
        }

        let blob = null;
        try {
          blob = dataUrlToBlob(dataUrl);
        } catch {
          blob = new Blob([dataUrl], { type: targetFormat });
        }

        const cleanBase = (file.name || 'school_photo').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
        const ext = targetFormat === 'image/webp' ? '.webp' : '.jpg';
        const compressedFileName = `${cleanBase}_opt${ext}`;

        const compressedFile = new File([blob], compressedFileName, {
          type: targetFormat,
          lastModified: Date.now()
        });

        const originalBytes = file.size || blob.size;
        const compressedBytes = blob.size;
        const savingsPercent = originalBytes > 0
          ? Math.max(0, Math.round(((originalBytes - compressedBytes) / originalBytes) * 100))
          : 0;

        cleanup();
        resolve({
          file: compressedFile,
          dataUrl,
          width,
          height,
          originalBytes,
          compressedBytes,
          originalSizeFormatted: formatBytes(originalBytes),
          compressedSizeFormatted: formatBytes(compressedBytes),
          savingsPercent: `${savingsPercent}%`
        });
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    const img = new Image();
    img.onload = () => processImageElement(img);
    img.onerror = () => {
      if (objectUrl) {
        try { URL.revokeObjectURL(objectUrl); } catch {}
        objectUrl = null;
      }
      const reader = new FileReader();
      reader.onload = (re) => {
        const fallbackImg = new Image();
        fallbackImg.onload = () => processImageElement(fallbackImg);
        fallbackImg.onerror = () => {
          cleanup();
          reject(new Error('Unable to read this image format in browser.'));
        };
        fallbackImg.src = re.target.result;
      };
      reader.onerror = () => {
        cleanup();
        reject(new Error('Failed to read file from disk.'));
      };
      reader.readAsDataURL(file);
    };

    if (objectUrl) {
      img.src = objectUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (re) => {
        img.src = re.target.result;
      };
      reader.onerror = () => {
        cleanup();
        reject(new Error('Failed to read file from disk.'));
      };
      reader.readAsDataURL(file);
    }
  });
}
