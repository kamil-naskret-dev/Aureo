import { ImagePlus } from 'lucide-react';
import { useRef } from 'react';

import { AVATAR_ACCEPT } from '../constants/avatar.constants';
import { useFileDrop } from '../hooks/useFileDrop';

type Props = {
  onFile: (file: File) => void;
};

export const AvatarDropZone = ({ onFile }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDragging, dragHandlers } = useFileDrop(onFile);

  const openPicker = () => fileInputRef.current?.click();

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={AVATAR_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
        aria-hidden="true"
      />
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload photo — click or drag and drop"
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        {...dragHandlers}
        className={[
          'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 cursor-pointer transition-colors select-none',
          isDragging
            ? 'border-custom-primary-700 bg-custom-primary-700/5'
            : 'border-custom-neutral-200 hover:border-custom-primary-700 hover:bg-custom-neutral-50 dark:border-custom-neutral-700 dark:hover:border-custom-primary-700 dark:hover:bg-custom-neutral-900',
        ].join(' ')}
      >
        <div
          className={[
            'flex size-12 items-center justify-center rounded-full transition-colors',
            isDragging
              ? 'bg-custom-primary-700/10'
              : 'bg-custom-neutral-100 dark:bg-custom-neutral-800',
          ].join(' ')}
        >
          <ImagePlus
            className={[
              'size-5 transition-colors',
              isDragging
                ? 'text-custom-primary-700'
                : 'text-custom-neutral-600 dark:text-custom-neutral-300',
            ].join(' ')}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-custom-neutral-900 dark:text-white">
            {isDragging ? 'Drop photo here' : 'Click to upload or drag and drop'}
          </p>
          <p className="mt-1 text-xs text-custom-neutral-500 dark:text-custom-neutral-400">
            JPEG, PNG, WebP or GIF · max 5 MB
          </p>
        </div>
      </div>
    </>
  );
};
