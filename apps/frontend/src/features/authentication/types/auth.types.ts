export type UserRole = 'USER' | 'ADMIN';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image: string | null;
};

export type LoginData = {
  accessToken: string;
  user: AuthUser;
};

export type MessageData = {
  success: boolean;
  message: string;
};
