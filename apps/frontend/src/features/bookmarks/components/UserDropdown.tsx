import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Spinner,
} from '@aureo/ui';
import { LogOut, Palette } from 'lucide-react';

import { useTheme } from '../../../hooks/useTheme';
import { useLogout } from '../../authentication/hooks/useLogout';
import { AuthUser } from '../../authentication/types/auth.types';
import { ThemeToggle } from './ThemeToggle';

type UserDropdownProps = {
  user: AuthUser;
};

const UserAvatar = ({ user }: { user: AuthUser }) => {
  const initials = user.name
    ?.split(' ')
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <Avatar>
      <AvatarImage src={user.image ?? undefined} alt={user.email} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export const UserDropdown = ({ user }: UserDropdownProps) => {
  const { mutate: logout, isPending } = useLogout();
  const { isDark, toggleTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="shrink-0 rounded-full transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-primary-700 dark:focus-visible:outline-custom-neutral-100"
          aria-label="User menu"
        >
          <UserAvatar user={user} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-custom-neutral-900 leading-[140%] dark:text-white">
                {user.name}
              </p>
              <p className="text-sm font-medium leading-[150%] tracking-[1%] text-custom-neutral-800 dark:text-custom-neutral-100">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="py-1 px-2">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              toggleTheme();
            }}
            className="group text-custom-neutral-800 dark:text-custom-neutral-100"
          >
            <Palette className="size-4 shrink-0" />
            Theme
            <div
              aria-hidden="true"
              className="ml-auto rounded-xl group-focus:outline-2 group-focus:outline-custom-primary-700 group-focus:outline-offset-2 dark:outline-custom-neutral-100"
            >
              <ThemeToggle isDark={isDark} />
            </div>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <div className="py-1 px-2">
          <DropdownMenuItem
            onClick={() => logout()}
            disabled={isPending}
            className="text-custom-neutral-800 dark:text-custom-neutral-100"
          >
            {isPending ? <Spinner className="size-4" /> : <LogOut />}
            {isPending ? 'Logging out...' : 'Logout'}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
