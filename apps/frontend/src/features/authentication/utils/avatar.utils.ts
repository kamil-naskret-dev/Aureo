import type { Area } from 'react-easy-crop';

import { API_BASE, AVATAR_OUTPUT_SIZE } from '../constants/avatar.constants';

export const resolveAvatarUrl = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined;
  return url.startsWith('/') ? `${API_BASE}${url}` : url;
};

export const getCroppedBlob = (imageSrc: string, pixelCrop: Area): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = AVATAR_OUTPUT_SIZE;
      canvas.height = AVATAR_OUTPUT_SIZE;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        AVATAR_OUTPUT_SIZE,
        AVATAR_OUTPUT_SIZE,
      );

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to encode image'));
        },
        'image/jpeg',
        0.92,
      );
    };

    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = imageSrc;
  });
