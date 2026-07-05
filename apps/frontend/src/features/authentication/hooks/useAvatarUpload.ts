import { useState } from 'react';
import { toast } from 'sonner';

import { useAuthStore } from '../../../store/auth.store';
import { updateAvatarApi } from '../api/users.api';

type UseAvatarUpload = {
  upload: (blob: Blob) => Promise<void>;
  uploadProgress: number | null;
  isUploading: boolean;
};

export const useAvatarUpload = (): UseAvatarUpload => {
  const setUserImage = useAuthStore((s) => s.setUserImage);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const upload = async (blob: Blob) => {
    setUploadProgress(0);
    try {
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      const { avatarUrl } = await updateAvatarApi(file, setUploadProgress);
      setUserImage(avatarUrl);
      toast.success('Avatar updated.');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploadProgress(null);
    }
  };

  return { upload, uploadProgress, isUploading: uploadProgress !== null };
};
