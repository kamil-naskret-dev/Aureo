import {
  AVATAR_RING_CIRCUMFERENCE,
  AVATAR_RING_RADIUS,
  AVATAR_RING_SIZE,
} from '../constants/avatar.constants';

type Props = {
  progress: number;
};

export const AvatarProgressRing = ({ progress }: Props) => {
  const dashOffset = AVATAR_RING_CIRCUMFERENCE - (progress / 100) * AVATAR_RING_CIRCUMFERENCE;

  return (
    <svg
      width={AVATAR_RING_SIZE}
      height={AVATAR_RING_SIZE}
      viewBox={`0 0 ${AVATAR_RING_SIZE} ${AVATAR_RING_SIZE}`}
      style={{ position: 'absolute', inset: '-3px', pointerEvents: 'none' }}
      className="-rotate-90"
      aria-hidden="true"
    >
      <circle
        cx={AVATAR_RING_SIZE / 2}
        cy={AVATAR_RING_SIZE / 2}
        r={AVATAR_RING_RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        className="text-custom-primary-700/25"
      />
      <circle
        cx={AVATAR_RING_SIZE / 2}
        cy={AVATAR_RING_SIZE / 2}
        r={AVATAR_RING_RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={AVATAR_RING_CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        className="text-custom-primary-700 transition-[stroke-dashoffset] duration-150 ease-linear"
      />
    </svg>
  );
};
