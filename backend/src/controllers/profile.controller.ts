import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { findUserById, updateUserProfile, findUserByEmail, updateUserProfilePhoto, removeUserProfilePhoto } from '../database/users';
import { supabase } from '../config/supabase';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      url: user.url || null,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Erro ao buscar perfil' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Dados inválidos', errors: errors.array() });
    }

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Nome e email são obrigatórios' });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (email !== user.email) {
      const existingUser = await findUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({ message: 'Email já está em uso' });
      }
    }

    const updatedUser = await updateUserProfile(userId, name, email);

    if (!updatedUser) {
      return res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }

    return res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
};

export const uploadProfilePhoto = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada' });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Deletar foto antiga se existir
    if (user.url) {
      try {
        const oldFileName = user.url.split('/').pop();
        if (oldFileName) {
          await supabase.storage.from('profile-photos').remove([`${userId}/${oldFileName}`]);
        }
      } catch (error) {
        console.error('Error deleting old photo:', error);
      }
    }

    // Enviar nova foto
    const fileExtension = req.file.originalname.split('.').pop();
    const fileName = `${userId}/profile-${Date.now()}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ message: 'Erro ao enviar foto' });
    }

    // Receber URL pública da foto
    const { data: publicData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    const photoUrl = publicData.publicUrl;

    // Atualizar perfil do usuário com a nova URL da foto
    const updatedUser = await updateUserProfilePhoto(userId, photoUrl);

    if (!updatedUser) {
      return res.status(500).json({ message: 'Erro ao atualizar foto do perfil' });
    }

    return res.json({
      message: 'Foto de perfil atualizada com sucesso',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        url: updatedUser.url,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar foto de perfil:', error);
    return res.status(500).json({ message: 'Erro ao atualizar foto de perfil' });
  }
};

export const removeProfilePhoto = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (user.url) {
      try {
        const oldFileName = user.url.split('/').pop();
        if (oldFileName) {
          await supabase.storage.from('profile-photos').remove([`${userId}/${oldFileName}`]);
        }
      } catch (error) {
        console.error('Erro ao deletar foto:', error);
      }
    }

    // Atualiza o perfil do usuário para remover a URL da foto
    const updatedUser = await removeUserProfilePhoto(userId);

    if (!updatedUser) {
      return res.status(500).json({ message: 'Erro ao remover foto do perfil' });
    }

    return res.json({
      message: 'Foto de perfil removida com sucesso',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        url: updatedUser.url,
      },
    });
  } catch (error) {
    console.error('Erro ao remover foto de perfil:', error);
    return res.status(500).json({ message: 'Erro ao remover foto de perfil' });
  }
};
