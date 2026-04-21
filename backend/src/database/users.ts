import { supabase } from '../config/supabase';
import { User, PasswordResetCode } from '../types';
import { hashPassword } from '../utils/password';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface PendingUser {
  email: string;
  password?: string;
  name?: string;
  code: string;
  expiresAt: Date;
}

const pendingUsers: PendingUser[] = [];

export const savePendingUser = (email: string, password?: string, name?: string, code?: string): void => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);
  
  const existingIndex = pendingUsers.findIndex(pu => pu.email === email);
  if (existingIndex !== -1) {
    pendingUsers.splice(existingIndex, 1);
  }
  
  pendingUsers.push({ email, password, name, code: code || '', expiresAt });
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


export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return undefined;
  
  return {
    id: data.idusuario.toString(),
    email: data.email,
    name: data.nome,
    password: data.senha,
    createdAt: new Date(), 
  };
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('idusuario', parseInt(id))
    .single();

  if (error || !data) return undefined;

  return {
     id: data.idusuario.toString(),
     email: data.email,
     name: data.nome,
     password: data.senha,
     createdAt: new Date(), 
  };
};

export const createUser = async (email: string, plainPassword?: string, name?: string): Promise<User> => {
   const hashedPassword = plainPassword ? await hashPassword(plainPassword) : undefined;
   
   const { data, error } = await supabase
    .from('usuario')
    .insert([{ email, senha: hashedPassword, nome: name }])
    .select()
    .single();
    
    if (error) {
        console.error("Error creating user:", error);
        throw error;
    }

    return {
         id: data.idusuario.toString(),
         email: data.email,
         name: data.nome,
         password: data.senha,
         createdAt: new Date(), 
    };
};

export const updateUserPassword = async (email: string, newPassword?: string): Promise<void> => {
   const hashedPassword = newPassword ? await hashPassword(newPassword) : undefined;
   
   const { error } = await supabase
    .from('usuario')
    .update({ senha: hashedPassword })
    .eq('email', email);

   if (error) {
       console.error("Error updating user password:", error);
       throw error;
   }
};

export const updateUserProfile = async (userId: string, name: string, email: string): Promise<User | undefined> => {
   const { data, error } = await supabase
    .from('usuario')
    .update({ nome: name, email: email })
    .eq('idusuario', parseInt(userId))
    .select()
    .single();

   if (error || !data) {
       console.error("Error updating user profile:", error);
       return undefined;
   }

   return {
         id: data.idusuario.toString(),
         email: data.email,
         name: data.nome,
         password: data.senha,
         createdAt: new Date(), 
    };
};

export const saveResetCode = (email: string, code: string): void => {
   savePendingUser(email, undefined, undefined, code);
};

export const verifyResetCode = (email: string, code: string): boolean => {
  return getPendingUser(email, code) !== undefined;
};

export const deleteResetCode = (email: string): void => {
  deletePendingUser(email);
};
