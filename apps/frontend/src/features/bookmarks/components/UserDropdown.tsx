import {
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

const Avatar = ({ user }: { user: AuthUser }) => {
  if (user.image) {
    return (
      <img
        src={user.image}
        alt={user.email}
        className="size-10 shrink-0 rounded-full object-cover aspect-square"
      />
    );
  }

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <div className="size-10 shrink-0 flex items-center justify-center rounded-full bg-custom-primary-700 text-xs font-semibold text-white">
      {initials}
    </div>
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
          className="shrink-0 rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-700 focus-visible:ring-offset-2"
          aria-label="User menu"
        >
          <Avatar user={user} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar user={user} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-custom-neutral-900 leading-[140%]">
                {user.name}
              </p>
              <p className="text-sm font-medium leading-[150%] tracking-[1%] text-custom-neutral-800">
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
            className="text-custom-neutral-800"
          >
            <Palette className="size-4 shrink-0" />
            Theme
            <div aria-hidden="true" className="ml-auto">
              <ThemeToggle isDark={isDark} />
            </div>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <div className="py-1 px-2">
          <DropdownMenuItem
            onClick={() => logout()}
            disabled={isPending}
            className="text-custom-neutral-800"
          >
            {isPending ? <Spinner className="size-4" /> : <LogOut />}
            {isPending ? 'Logging out...' : 'Log out'}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
