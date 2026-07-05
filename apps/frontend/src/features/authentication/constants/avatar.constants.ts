export const AVATAR_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const AVATAR_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const AVATAR_ACCEPT = AVATAR_ALLOWED_TYPES.join(',');

export const AVATAR_OUTPUT_SIZE = 256;

export const AVATAR_ZOOM_MIN = 1;
export const AVATAR_ZOOM_MAX = 3;

export const AVATAR_RING_SIZE = 46;
export const AVATAR_RING_RADIUS = 20;
export const AVATAR_RING_CIRCUMFERENCE = 2 * Math.PI * AVATAR_RING_RADIUS;

export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
