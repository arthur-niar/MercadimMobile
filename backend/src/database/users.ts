import { supabase } from "../config/supabase";
import { User, PasswordResetCode } from "../types";
import { hashPassword } from "../utils/password";

export interface PendingUser {
  email: string;
  password?: string;
  name?: string;
  url?: string;
  code: string;
  expiresAt: Date;
}

// ---------------------------------------------------------------------------
// Supabase-backed verification code helpers (replaces the old in-memory array)
// ---------------------------------------------------------------------------

export const savePendingUser = async (
  email: string,
  password?: string,
  name?: string,
  code?: string,
): Promise<void> => {
  const expira_em = new Date();
  expira_em.setMinutes(expira_em.getMinutes() + 15);

  // Remove any existing code for this email + type before inserting a fresh one
  await supabase
    .from('codigo_verificacao')
    .delete()
    .eq('email', email)
    .eq('tipo', 'registro');

  const { error } = await supabase.from('codigo_verificacao').insert([
    {
      email,
      codigo: code || '',
      tipo: 'registro',
      dados_adicionais: { password, name },
      expira_em: expira_em.toISOString(),
    },
  ]);

  if (error) {
    console.error('Erro ao salvar código de registro no Supabase:', error);
    throw error;
  }
};

export const getPendingUser = async (
  email: string,
  code: string,
): Promise<PendingUser | undefined> => {
  const { data, error } = await supabase
    .from('codigo_verificacao')
    .select('*')
    .eq('email', email)
    .eq('codigo', code)
    .eq('tipo', 'registro')
    .single();

  if (error || !data) return undefined;

  // Check expiry
  if (new Date() > new Date(data.expira_em)) return undefined;

  return {
    email: data.email,
    code: data.codigo,
    password: data.dados_adicionais?.password,
    name: data.dados_adicionais?.name,
    expiresAt: new Date(data.expira_em),
  };
};

export const deletePendingUser = async (email: string): Promise<void> => {
  const { error } = await supabase
    .from('codigo_verificacao')
    .delete()
    .eq('email', email)
    .eq('tipo', 'registro');

  if (error) {
    console.error('Erro ao deletar código de registro no Supabase:', error);
  }
};

export const findUserByEmail = async (
  email: string,
): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from("usuario")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return undefined;

  return {
    id: data.idusuario.toString(),
    email: data.email,
    name: data.nome,
    password: data.senha,
    createdAt: new Date(),
    url: data.url || "",
  };
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from("usuario")
    .select("*")
    .eq("idusuario", parseInt(id))
    .single();

  if (error || !data) return undefined;

  return {
    id: data.idusuario.toString(),
    email: data.email,
    name: data.nome,
    password: data.senha,
    createdAt: new Date(),
    url: data.url || "",
  };
};

export const createUser = async (
  email: string,
  plainPassword?: string,
  name?: string,
  url?: string,
): Promise<User> => {
  const hashedPassword = plainPassword
    ? await hashPassword(plainPassword)
    : undefined;

  const { data, error } = await supabase
    .from("usuario")
    .insert([
      {
        email,
        senha: hashedPassword,
        nome: name,
        url: url || "0",
        dataCriacao: new Date(),
      },
    ])
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
    url: data.url || "",
    createdAt: new Date(),
  };
};

export const updateUserPassword = async (
  email: string,
  newPassword?: string,
): Promise<void> => {
  const hashedPassword = newPassword
    ? await hashPassword(newPassword)
    : undefined;

  const { error } = await supabase
    .from("usuario")
    .update({ senha: hashedPassword })
    .eq("email", email);

  if (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};

export const updateUserUrl = async (
  userId: string,
  url: string,
): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from("usuario")
    .update({ url: url })
    .eq("idusuario", parseInt(userId))
    .select()
    .single();

  if (error || !data) {
    console.error("Error updating user URL:", error);
    return undefined;
  }

  return {
    id: data.idusuario.toString(),
    email: data.email,
    name: data.nome,
    url: data.url,
    password: data.senha,
    createdAt: new Date(),
  };
};

export const updateUserProfile = async (
  userId: string,
  name: string,
  email: string,
): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from("usuario")
    .update({ nome: name, email: email })
    .eq("idusuario", parseInt(userId))
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
    url: data.url || "",
  };
};

export const updateUserProfilePhoto = async (
  userId: string,
  photoUrl: string,
): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from("usuario")
    .update({ url: photoUrl })
    .eq("idusuario", parseInt(userId))
    .select()
    .single();

  if (error || !data) {
    console.error("Erro para a atualização de foto do Usuário:", error);
    return undefined;
  }

  return {
    id: data.idusuario.toString(),
    email: data.email,
    name: data.nome,
    password: data.senha,
    createdAt: new Date(),
    url: data.url || "",
  };
};

export const removeUserProfilePhoto = async (
  userId: string,
): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from("usuario")
    .update({ url: null })
    .eq("idusuario", parseInt(userId))
    .select()
    .single();

  if (error || !data) {
    console.error("Erro removendo a foto do Usuário:", error);
    return undefined;
  }

  return {
    id: data.idusuario.toString(),
    email: data.email,
    name: data.nome,
    password: data.senha,
    createdAt: new Date(),
    url: data.url || "",
  };
};

export const saveResetCode = async (email: string, code: string): Promise<void> => {
  const expira_em = new Date();
  expira_em.setMinutes(expira_em.getMinutes() + 15);

  // Remove any existing reset code for this email
  await supabase
    .from('codigo_verificacao')
    .delete()
    .eq('email', email)
    .eq('tipo', 'redefinicao');

  const { error } = await supabase.from('codigo_verificacao').insert([
    {
      email,
      codigo: code,
      tipo: 'redefinicao',
      dados_adicionais: null,
      expira_em: expira_em.toISOString(),
    },
  ]);

  if (error) {
    console.error('Erro ao salvar código de redefinição no Supabase:', error);
    throw error;
  }
};

export const verifyResetCode = async (email: string, code: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('codigo_verificacao')
    .select('*')
    .eq('email', email)
    .eq('codigo', code)
    .eq('tipo', 'redefinicao')
    .single();

  if (error || !data) return false;

  // Check expiry
  if (new Date() > new Date(data.expira_em)) return false;

  return true;
};

export const deleteResetCode = async (email: string): Promise<void> => {
  const { error } = await supabase
    .from('codigo_verificacao')
    .delete()
    .eq('email', email)
    .eq('tipo', 'redefinicao');

  if (error) {
    console.error('Erro ao deletar código de redefinição no Supabase:', error);
  }
};
