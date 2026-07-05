import { create } from 'zustand';

import { AuthUser } from '../features/authentication/types/auth.types';

type AuthUnauthenticated = {
  isAuthenticated: false;
  user: null;
  accessToken: null;
};

type AuthAuthenticated = {
  isAuthenticated: true;
  user: AuthUser;
  accessToken: string;
};

type AuthActions = {
  isInitialized: boolean;
  setAuth: (accessToken: string, user: AuthUser) => void;
  clearAuth: () => void;
  setInitialized: (value: boolean) => void;
  setUserImage: (image: string | null) => void;
};

type AuthState = (AuthUnauthenticated | AuthAuthenticated) & AuthActions;

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  isInitialized: false,

  setAuth: (accessToken, user) => set({ isAuthenticated: true, accessToken, user }),

  clearAuth: () => set({ isAuthenticated: false, user: null, accessToken: null }),

  setInitialized: (value) => set({ isInitialized: value }),

  setUserImage: (image) =>
    set((state) => (state.isAuthenticated ? { user: { ...state.user, image } } : state)),
}));

export const getAccessToken = () => useAuthStore.getState().accessToken;

export const useUser = (): AuthUser => {
  const user = useAuthStore((s) => s.user);
  if (!user) throw new Error('useUser must be called inside an authenticated route');
  return user;
};
