import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import { ApiEnvelope } from '../../../lib/http/api-types';
import { http } from '../../../lib/http/http';
import { useAuthStore } from '../../../store/auth.store';
import { LoginData } from '../types/auth.types';

type QueueEntry = {
  resolve: (token: string) => void;
  reject: (reason: unknown) => void;
};

class AuthSessionService {
  private isRefreshing = false;
  private refreshQueue: QueueEntry[] = [];

  async refreshSession(): Promise<LoginData> {
    const { data } = await axios.post<ApiEnvelope<LoginData>>(
      `${http.defaults.baseURL}/api/auth/refresh`,
      {},
      { withCredentials: true },
    );

    const { accessToken, user } = data.data;
    useAuthStore.getState().setAuth(accessToken, user);
    return data.data;
  }

  async handleUnauthorized(originalConfig: InternalAxiosRequestConfig): Promise<unknown> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.refreshQueue.push({ resolve, reject });
      }).then((token) => {
        originalConfig.headers.Authorization = `Bearer ${token}`;
        return http(originalConfig);
      });
    }

    originalConfig._retry = true;
    this.isRefreshing = true;

    try {
      const { accessToken } = await this.refreshSession();

      this.refreshQueue.forEach(({ resolve }) => resolve(accessToken));

      originalConfig.headers.Authorization = `Bearer ${accessToken}`;
      return http(originalConfig);
    } catch (err) {
      this.refreshQueue.forEach(({ reject }) => reject(err));
      await this.clearSession();
      throw new Error('Session expired. Please log in again.');
    } finally {
      this.isRefreshing = false;
      this.refreshQueue = [];
    }
  }

  async initialize(): Promise<void> {
    if (useAuthStore.getState().isInitialized) return;

    try {
      await this.refreshSession();
    } catch {
      // Refresh token is invalid/expired — user needs to log in again, don't throw error here
    } finally {
      useAuthStore.getState().setInitialized(true);
    }
  }

  private async clearSession(): Promise<void> {
    useAuthStore.getState().clearAuth();

    const { router } = await import('../../../router');
    router.navigate({ to: '/' });
  }
}

export const authSessionService = new AuthSessionService();
