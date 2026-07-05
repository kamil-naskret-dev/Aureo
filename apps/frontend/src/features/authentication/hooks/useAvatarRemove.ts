import { useState } from 'react';
import { toast } from 'sonner';

import { useAuthStore } from '../../../store/auth.store';
import { removeAvatarApi } from '../api/users.api';

type UseAvatarRemove = {
  remove: () => Promise<void>;
  isRemoving: boolean;
};

export const useAvatarRemove = (): UseAvatarRemove => {
  const setUserImage = useAuthStore((s) => s.setUserImage);
  const [isRemoving, setIsRemoving] = useState(false);

  const remove = async () => {
    setIsRemoving(true);
    try {
      await removeAvatarApi();
      setUserImage(null);
      toast.success('Avatar removed.');
    } catch {
      toast.error('Failed to remove avatar');
    } finally {
      setIsRemoving(false);
    }
  };

  return { remove, isRemoving };
};
