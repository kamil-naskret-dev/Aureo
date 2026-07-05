import { Button, DialogFooter } from '@aureo/ui';
import { ZoomIn, ZoomOut } from 'lucide-react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';

import { AVATAR_ZOOM_MAX, AVATAR_ZOOM_MIN } from '../constants/avatar.constants';

type Props = {
  imageSrc: string;
  crop: Point;
  zoom: number;
  onCropChange: (crop: Point) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedAreaPercent: Area, croppedAreaPixels: Area) => void;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
};

export const AvatarCropStep = ({
  imageSrc,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onBack,
  onSave,
  isSaving,
}: Props) => {
  const zoomPercent = Math.round(
    ((zoom - AVATAR_ZOOM_MIN) / (AVATAR_ZOOM_MAX - AVATAR_ZOOM_MIN)) * 100,
  );

  return (
    <>
      <div className="relative h-72 w-full bg-neutral-950 dark:bg-black">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          minZoom={AVATAR_ZOOM_MIN}
          maxZoom={AVATAR_ZOOM_MAX}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
          classes={{
            containerClassName: 'rounded-none',
            cropAreaClassName: 'border-2 border-white/80',
          }}
        />
      </div>

      <div className="px-6 py-4 border-t border-custom-neutral-100 dark:border-custom-neutral-800">
        <div className="flex items-center gap-3">
          <ZoomOut className="size-4 shrink-0 text-custom-neutral-500 dark:text-custom-neutral-400" />
          <input
            type="range"
            min={AVATAR_ZOOM_MIN}
            max={AVATAR_ZOOM_MAX}
            step={0.01}
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            aria-label={`Zoom: ${zoomPercent}%`}
            className="w-full accent-custom-primary-700 cursor-pointer"
          />
          <ZoomIn className="size-4 shrink-0 text-custom-neutral-500 dark:text-custom-neutral-400" />
          <span className="w-10 shrink-0 text-right text-xs tabular-nums text-custom-neutral-500 dark:text-custom-neutral-400">
            {zoomPercent}%
          </span>
        </div>
        <p className="mt-2 text-center text-xs text-custom-neutral-400 dark:text-custom-neutral-500">
          Drag to reposition · scroll or pinch to zoom
        </p>
      </div>

      <DialogFooter className="px-6 pb-6 gap-2">
        <Button variant="outline" onClick={onBack} disabled={isSaving}>
          Choose different photo
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save avatar'}
        </Button>
      </DialogFooter>
    </>
  );
};
