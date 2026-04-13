import { User, PasswordResetCode } from '../types';
import { hashPassword } from '../utils/password';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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

  const { data, error } = await supabase.from('usuario').insert([{
    nome: user.name,
    email: user.email,
    senha: user.password,
    url: '' // Adicione se necessário
  }]);

  if (error) {
    throw new Error(`Erro ao salvar usuário: ${error.message}`);
  }

  return user;
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('usuario').select('*');

  if (error) {
    throw new Error(`Erro ao buscar usuários: ${error.message}`);
  }

  return data.map((u: any) => ({
    id: u.id.toString(),
    email: u.email,
    password: u.senha,
    name: u.nome,
    createdAt: new Date(u.created_at || Date.now()),
  }));
};

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const { data, error } = await supabase.from('usuario').select('*').eq('email', email.toLowerCase()).single();

  if (error || !data) return undefined;

  return {
    id: data.id.toString(),
    email: data.email,
    password: data.senha,
    name: data.nome,
    createdAt: new Date(data.created_at || Date.now()),
  };
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  const { data, error } = await supabase.from('usuario').select('*').eq('id', id).single();

  if (error || !data) return undefined;

  return {
    id: data.id.toString(),
    email: data.email,
    password: data.senha,
    name: data.nome,
    createdAt: new Date(data.created_at || Date.now()),
  };
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
  const hashedPassword = await hashPassword(newPassword);
  const { error } = await supabase.from('usuario').update({ senha: hashedPassword }).eq('email', email.toLowerCase());

  if (error) {
    throw new Error(`Erro ao atualizar senha: ${error.message}`);
  }
};

// Removido: createUser('teste@mercadim.com', 'senha123', 'Usuário Teste');
// Agora os usuários são salvos no Supabase via createUser
