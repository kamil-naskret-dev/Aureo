import { ApiEnvelope } from '../../../lib/http/api-types';
import { http } from '../../../lib/http/http';
import { LoginFormValues } from '../schemas/login-schema';
import { LoginData, MessageData } from '../types/auth.types';

export const loginApi = async (data: LoginFormValues): Promise<LoginData> => {
  const response = await http.post<ApiEnvelope<LoginData>>('/api/auth/login', data);
  return response.data.data;
};

export const logoutApi = async (): Promise<MessageData> => {
  const response = await http.post<ApiEnvelope<MessageData>>('/api/auth/logout');
  return response.data.data;
};

export const registerApi = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<MessageData> => {
  const response = await http.post<ApiEnvelope<MessageData>>('/api/auth/register', data);
  return response.data.data;
};

export const forgotPasswordApi = async (data: { email: string }): Promise<MessageData> => {
  const response = await http.post<ApiEnvelope<MessageData>>('/api/auth/forgot-password', data);
  return response.data.data;
};

export const resetPasswordApi = async (data: {
  token: string;
  password: string;
}): Promise<MessageData> => {
  const response = await http.post<ApiEnvelope<MessageData>>('/api/auth/reset-password', data);
  return response.data.data;
};

export const verifyEmailApi = async (token: string): Promise<MessageData> => {
  const response = await http.get<ApiEnvelope<MessageData>>('/api/auth/verify-email', {
    params: { token },
  });
  return response.data.data;
};

export const resendVerificationApi = async (data: { email: string }): Promise<MessageData> => {
  const response = await http.post<ApiEnvelope<MessageData>>('/api/auth/resend-verification', data);
  return response.data.data;
};
