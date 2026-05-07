import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { SWAGGER_BEARER_NAME } from '../constants/swagger.constants.js';

export function ApiAuth() {
  return applyDecorators(
    ApiBearerAuth(SWAGGER_BEARER_NAME),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
