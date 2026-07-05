import { ApiEnvelope } from '../../../lib/http/api-types';
import { http } from '../../../lib/http/http';

export const updateAvatarApi = async (
  file: File,
  onUploadProgress?: (percent: number) => void,
): Promise<{ avatarUrl: string }> => {
  const form = new FormData();
  form.append('avatar', file);
  const response = await http.patch<ApiEnvelope<{ avatarUrl: string }>>(
    '/api/users/me/avatar',
    form,
    {
      onUploadProgress: (event) => {
        if (event.total) {
          onUploadProgress?.(Math.round((event.loaded / event.total) * 100));
        }
      },
    },
  );
  return response.data.data;
};

export const removeAvatarApi = async (): Promise<void> => {
  await http.delete('/api/users/me/avatar');
};
