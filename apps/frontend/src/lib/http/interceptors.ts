import { authSessionService } from '../../features/authentication/services/auth-session.service';
import { getAccessToken } from '../../store/auth.store';
import { ApiError } from './api-error';
import { ApiErrorResponse } from './api-types';
import { http } from './http';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const setupHttpInterceptors = () => {
  http.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  http.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!error.response) {
        return Promise.reject(
          new ApiError(0, 'Network Error', ['Something went wrong. Please try again.']),
        );
      }

      const { config: originalConfig, response } = error;
      const isRefreshEndpoint = originalConfig.url?.includes('/auth/refresh');
      const wasAuthenticated = !!originalConfig.headers.Authorization;

      if (
        response.status === 401 &&
        !originalConfig._retry &&
        !isRefreshEndpoint &&
        wasAuthenticated
      ) {
        return authSessionService.handleUnauthorized(originalConfig);
      }

      const body: ApiErrorResponse = response.data;
      const messages = Array.isArray(body.message) ? body.message : [body.message];
      return Promise.reject(new ApiError(body.statusCode, body.error, messages, body.path));
    },
  );
};
