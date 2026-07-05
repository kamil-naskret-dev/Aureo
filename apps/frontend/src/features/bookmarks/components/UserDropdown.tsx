import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Spinner,
} from '@aureo/ui';
import { LogOut, Palette, Trash2, UserRound } from 'lucide-react';
import { useState } from 'react';

import { useTheme } from '../../../hooks/useTheme';
import { useLogout } from '../../authentication/hooks/useLogout';
import { useAvatarUpload } from '../../authentication/hooks/useAvatarUpload';
import { useAvatarRemove } from '../../authentication/hooks/useAvatarRemove';
import { AvatarCropModal } from '../../authentication/components/AvatarCropModal';
import { AvatarProgressRing } from '../../authentication/components/AvatarProgressRing';
import { UserAvatar } from '../../authentication/components/UserAvatar';
import { useUser } from '../../../store/auth.store';
import { ThemeToggle } from './ThemeToggle';

export const UserDropdown = () => {
  const user = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { isDark, toggleTheme } = useTheme();
  const [isCropOpen, setIsCropOpen] = useState(false);

  const { upload, uploadProgress, isUploading } = useAvatarUpload();
  const { remove, isRemoving } = useAvatarRemove();

  return (
    <>
      <AvatarCropModal open={isCropOpen} onOpenChange={setIsCropOpen} onCrop={upload} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={isUploading ? `Uploading avatar… ${uploadProgress}%` : 'User menu'}
            aria-busy={isUploading}
            className="relative shrink-0 rounded-full transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-primary-700 dark:focus-visible:outline-custom-neutral-100"
          >
            <UserAvatar user={user} />
            {isUploading && <AvatarProgressRing progress={uploadProgress!} />}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <UserAvatar user={user} />
                {isUploading && <AvatarProgressRing progress={uploadProgress!} />}
              </div>
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
                setIsCropOpen(true);
              }}
              disabled={isUploading}
              className="text-custom-neutral-800 dark:text-custom-neutral-100"
            >
              <UserRound className="size-4 shrink-0" aria-hidden="true" />
              Change avatar
            </DropdownMenuItem>
            {user.image && (
              <DropdownMenuItem
                onSelect={() => void remove()}
                disabled={isRemoving || isUploading}
                className="text-custom-neutral-800 dark:text-custom-neutral-100"
              >
                {isRemoving ? (
                  <Spinner className="size-4 shrink-0" aria-hidden="true" />
                ) : (
                  <Trash2 className="size-4 shrink-0" aria-hidden="true" />
                )}
                {isRemoving ? 'Removing…' : 'Remove avatar'}
              </DropdownMenuItem>
            )}
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
              disabled={isLoggingOut}
              className="text-custom-neutral-800 dark:text-custom-neutral-100"
            >
              {isLoggingOut ? (
                <Spinner className="size-4" aria-hidden="true" />
              ) : (
                <LogOut aria-hidden="true" />
              )}
              {isLoggingOut ? 'Logging out…' : 'Logout'}
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
