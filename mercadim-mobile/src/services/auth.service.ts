import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { LoginCredentials, AuthResponse, PasswordResetRequest, PasswordResetVerify, EmailVerificationRequest, EmailVerificationCode, RegisterRequest } from '@/models';

export const authService = {

  async requestEmailVerification(data: EmailVerificationRequest): Promise<void> {
    try {
      await api.post('/auth/request-email-verification', data);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao solicitar código de verificação.');
    }
  },

  async verifyEmailCode(data: EmailVerificationCode): Promise<void> {
    try {
      await api.post('/auth/verify-email-code', data);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Código inválido ou expirado.');
    }
  },

  async cadastro(credentials: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      await AsyncStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      await AsyncStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao fazer login. Tente novamente.');
    }
  },

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    try {
      await api.post('/auth/forgot-password', data);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao solicitar recuperação de senha.');
    }
  },

  async verifyResetCode(data: PasswordResetVerify): Promise<void> {
    try {
      await api.post('/auth/reset-password', data);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao redefinir senha.');
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  },
};
