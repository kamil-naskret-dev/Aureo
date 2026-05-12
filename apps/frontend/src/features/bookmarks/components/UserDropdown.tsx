import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Spinner,
} from '@aureo/ui';
import { ChevronDown, LogOut, User } from 'lucide-react';

import { useLogout } from '../../authentication/hooks/useLogout';
import { AuthUser } from '../../authentication/types/auth.types';

type UserDropdownProps = {
  user: AuthUser;
};

export const UserDropdown = ({ user }: UserDropdownProps) => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-custom-neutral-200 bg-white px-3 py-2 text-sm transition-colors hover:bg-custom-neutral-100 dark:border-custom-neutral-700 dark:bg-custom-neutral-900 dark:hover:bg-custom-neutral-800"
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-custom-primary-700 text-xs font-semibold text-white">
            {user.email[0].toUpperCase()}
          </div>
          <ChevronDown className="size-3.5 text-custom-neutral-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-custom-primary-700 text-xs font-semibold text-white">
              {user.email[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-custom-neutral-900 dark:text-white">
                {user.email}
              </p>
              <p className="text-xs capitalize text-custom-neutral-400">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <User />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => logout()}
          disabled={isPending}
          className="text-destructive focus:text-destructive"
        >
          {isPending ? <Spinner className="size-4" /> : <LogOut />}
          {isPending ? 'Logging out...' : 'Log out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
