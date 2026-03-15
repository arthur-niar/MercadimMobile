export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PasswordResetCode {
  email: string;
  code: string;
  expiresAt: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
}
