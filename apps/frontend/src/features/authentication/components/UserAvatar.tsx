import { Avatar, AvatarFallback, AvatarImage } from '@aureo/ui';

import { resolveAvatarUrl } from '../utils/avatar.utils';
import { AuthUser } from '../types/auth.types';

type Props = {
  user: AuthUser;
};

export const UserAvatar = ({ user }: Props) => {
  const initials = user.name
    ?.split(' ')
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <Avatar>
      <AvatarImage src={resolveAvatarUrl(user.image)} alt={user.email} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};
