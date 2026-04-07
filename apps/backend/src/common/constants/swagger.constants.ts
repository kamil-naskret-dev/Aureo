export const SWAGGER_TITLE = 'Aureo API';
export const SWAGGER_DESCRIPTION =
  'REST API for Aureo — a personal bookmarking and tagging application.';
export const SWAGGER_VERSION = '1.0';
export const SWAGGER_BEARER_NAME = 'JWT';

export const SWAGGER_TAGS = {
  AUTH: 'auth',
  USERS: 'users',
  BOOKMARKS: 'bookmarks',
  TAGS: 'tags',
  HEALTH: 'health',
} as const;
