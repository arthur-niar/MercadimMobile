export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetVerify {
  email: string;
  code: string;
  newPassword: string;
}

export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationCode {
  email: string;
  code: string;
}

export interface RegisterRequest extends LoginCredentials {
  name: string;
}
