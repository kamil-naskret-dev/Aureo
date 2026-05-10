export type UserRole = 'USER' | 'ADMIN';

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type LoginData = {
  accessToken: string;
  user: AuthUser;
};

export type MessageData = {
  success: boolean;
  message: string;
};
