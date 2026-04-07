import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { SWAGGER_BEARER_NAME } from '../constants/swagger.constants.js';

/**
 * Combines @ApiBearerAuth() with a standard 401 Swagger response.
 * When the auth module is built, add @UseGuards(JwtAuthGuard) here
 * so all protected routes get the guard for free.
 */
export function ApiAuth() {
  return applyDecorators(
    ApiBearerAuth(SWAGGER_BEARER_NAME),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
