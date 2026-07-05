import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@aureo/ui';
import { useCallback, useState } from 'react';
import type { Area, Point } from 'react-easy-crop';
import { toast } from 'sonner';

import { useAuthStore } from '../../../store/auth.store';
import { AVATAR_ALLOWED_TYPES, AVATAR_MAX_FILE_SIZE } from '../constants/avatar.constants';
import { getCroppedBlob, resolveAvatarUrl } from '../utils/avatar.utils';
import { AvatarCropStep } from './AvatarCropStep';
import { AvatarDropZone } from './AvatarDropZone';

type Step = 'pick' | 'crop';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the cropped JPEG blob — parent is responsible for upload. */
  onCrop: (blob: Blob) => void;
};

export const AvatarCropModal = ({ open, onOpenChange, onCrop }: Props) => {
  const currentImage = useAuthStore((s) => (s.isAuthenticated ? s.user.image : null));

  const [step, setStep] = useState<Step>('pick');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const reset = () => {
    setStep('pick');
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
    setIsSaving(false);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) reset();
    onOpenChange(isOpen);
  };

  const loadFile = (file: File) => {
    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
      toast.error('Only JPEG, PNG, WebP or GIF files are allowed');
      return;
    }
    if (file.size > AVATAR_MAX_FILE_SIZE) {
      toast.error('File must be smaller than 5 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setStep('crop');
    };
    reader.onerror = () => toast.error('Failed to read file');
    reader.readAsDataURL(file);
  };

  const handleCropComplete = useCallback((_croppedAreaPercent: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedArea) {
      toast.error('Please select and crop a photo first');
      return;
    }
    setIsSaving(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedArea);
      onCrop(blob);
      handleClose(false);
    } catch {
      toast.error('Failed to process photo');
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{step === 'pick' ? 'Change avatar' : 'Crop photo'}</DialogTitle>
        </DialogHeader>

        {step === 'pick' ? (
          <div className="px-6 pb-6 flex flex-col gap-4">
            {currentImage && (
              <div className="flex items-center gap-3">
                <img
                  src={resolveAvatarUrl(currentImage)}
                  alt="Current avatar"
                  className="size-12 rounded-full object-cover ring-2 ring-custom-neutral-200 dark:ring-custom-neutral-700"
                />
                <div>
                  <p className="text-sm font-medium text-custom-neutral-900 dark:text-white">
                    Current photo
                  </p>
                  <p className="text-xs text-custom-neutral-500 dark:text-custom-neutral-400">
                    Upload a new one to replace it
                  </p>
                </div>
              </div>
            )}
            <AvatarDropZone onFile={loadFile} />
          </div>
        ) : imageSrc ? (
          <AvatarCropStep
            imageSrc={imageSrc}
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            onBack={reset}
            onSave={handleSave}
            isSaving={isSaving}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
