import { User, PasswordResetCode } from '../types';
import { hashPassword } from '../utils/password';

const users: User[] = [];
const resetCodes: PasswordResetCode[] = [];

interface PendingUser {
  email: string;
  password: string;
  name: string;
  code: string;
  expiresAt: Date;
}

const pendingUsers: PendingUser[] = [];

export const savePendingUser = (email: string, password: string, name: string, code: string): void => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);
  
  const existingIndex = pendingUsers.findIndex(pu => pu.email === email);
  if (existingIndex !== -1) {
    pendingUsers.splice(existingIndex, 1);
  }
  
  pendingUsers.push({ email, password, name, code, expiresAt });
};

export const getPendingUser = (email: string, code: string): PendingUser | undefined => {
  const pendingUser = pendingUsers.find(pu => pu.email === email && pu.code === code);
  
  if (!pendingUser) return undefined;
  if (new Date() > pendingUser.expiresAt) return undefined;
  
  return pendingUser;
};

export const deletePendingUser = (email: string): void => {
  const index = pendingUsers.findIndex(pu => pu.email === email);
  if (index !== -1) {
    pendingUsers.splice(index, 1);
  }
};

export const createUser = async (email: string, password: string, name: string): Promise<User> => {
  const hashedPassword = await hashPassword(password);
  const user: User = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    createdAt: new Date(),
  };
  users.push(user);
  return user;
};

export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const saveResetCode = (email: string, code: string): void => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);
  
  const existingIndex = resetCodes.findIndex(rc => rc.email === email);
  if (existingIndex !== -1) {
    resetCodes.splice(existingIndex, 1);
  }
  
  resetCodes.push({ email, code, expiresAt });
};

export const verifyResetCode = (email: string, code: string): boolean => {
  const resetCode = resetCodes.find(rc => rc.email === email && rc.code === code);
  
  if (!resetCode) return false;
  if (new Date() > resetCode.expiresAt) return false;
  
  return true;
};

export const deleteResetCode = (email: string): void => {
  const index = resetCodes.findIndex(rc => rc.email === email);
  if (index !== -1) {
    resetCodes.splice(index, 1);
  }
};

export const updateUserPassword = async (email: string, newPassword: string): Promise<void> => {
  const user = findUserByEmail(email);
  if (user) {
    user.password = await hashPassword(newPassword);
  }
};

createUser('teste@mercadim.com', 'senha123', 'Usuário Teste');
