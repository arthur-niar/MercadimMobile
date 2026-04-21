import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { findUserByEmail, saveResetCode, verifyResetCode, deleteResetCode, updateUserPassword, createUser, savePendingUser, getPendingUser, deletePendingUser } from '../database/users';
import { comparePassword, generateResetCode } from '../utils/password';
import { generateToken } from '../config/jwt';

export const requestRegister = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Dados inválidos', errors: errors.array() });
    }

    const { email, password, name } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const code = generateResetCode();
    savePendingUser(email, password, name, code);

    console.log(` CÓDIGO DE VERIFICAÇÃO - REGISTRO`);
    console.log(`Email: ${email}`);
    console.log(`Nome: ${name}`);
    console.log(`Código: ${code}`);
    
    return res.status(200).json({ message: 'Código de verificação enviado' });
  } catch (error) {
    console.error('Request register error:', error);
    return res.status(500).json({ message: 'Erro ao solicitar registro' });
  }
};

export const verifyRegister = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Dados inválidos', errors: errors.array() });
    }

    const { email, code } = req.body;

    const pendingUser = getPendingUser(email, code);
    if (!pendingUser) {
      return res.status(400).json({ message: 'Código inválido ou expirado' });
    }

    const user = await createUser(pendingUser.email, pendingUser.password, pendingUser.name);
    deletePendingUser(email);

    console.log(` Novo usuário registrado: ${user.email} - ${user.name}`);

    const token = generateToken({ userId: user.id, email: user.email });

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Verify register error:', error);
    return res.status(500).json({ message: 'Erro ao verificar código' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Dados inválidos', errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    console.log(` Login realizado: ${user.email} - ${user.name}`);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Email inválido', errors: errors.array() });
    }

    const { email } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Email não encontrado' });
    }

    const code = generateResetCode();
    saveResetCode(email, code);

    console.log(`Código de recuperação para ${email}: ${code}`);

    return res.json({ message: 'Código enviado para o email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Erro ao solicitar recuperação de senha' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Dados inválidos', errors: errors.array() });
    }

    const { email, code, newPassword } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Email não encontrado' });
    }

    const isCodeValid = verifyResetCode(email, code);
    if (!isCodeValid) {
      return res.status(400).json({ message: 'Código inválido ou expirado' });
    }

    await updateUserPassword(email, newPassword);
    deleteResetCode(email);

    return res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Erro ao redefinir senha' });
  }
};
