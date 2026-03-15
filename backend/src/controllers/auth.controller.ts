import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { findUserByEmail, saveResetCode, verifyResetCode, deleteResetCode, updateUserPassword } from '../database/users';
import { comparePassword, generateResetCode } from '../utils/password';
import { generateToken } from '../config/jwt';

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Dados inválidos', errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const token = generateToken({ userId: user.id, email: user.email });

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

    const user = findUserByEmail(email);
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

    const user = findUserByEmail(email);
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
