export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface RegisterVerifyRequest {
  email: string;
  code: string;
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
