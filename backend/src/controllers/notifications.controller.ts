import { Request, Response } from 'express';
import { getNotificationsByUserId, markNotificationAsRead, deleteAllNotificationsByUserId } from '../database/Notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || !user.userId) {
      return res.status(401).json({ message: 'Não autorizado. ID de usuário ausente.' });
    }

    const notifications = await getNotificationsByUserId(user.userId);
    return res.status(200).json({ notifications });
  } catch (error: any) {
    console.error('Erro ao buscar notificações:', error);
    return res.status(500).json({ message: 'Erro ao buscar notificações.' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    
    if (!user || !user.userId) {
      return res.status(401).json({ message: 'Não autorizado. ID de usuário ausente.' });
    }

    if (!id) {
      return res.status(400).json({ message: 'ID da notificação não fornecido.' });
    }

    await markNotificationAsRead(id, user.userId);
    return res.status(200).json({ message: 'Notificação marcada como lida.' });
  } catch (error: any) {
    console.error('Erro ao marcar notificação como lida:', error);
    return res.status(500).json({ message: 'Erro ao marcar notificação como lida.' });
  }
};

export const clearNotifications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || !user.userId) {
      return res.status(401).json({ message: 'Não autorizado. ID de usuário ausente.' });
    }

    await deleteAllNotificationsByUserId(user.userId);
    return res.status(200).json({ message: 'Histórico de notificações limpo.' });
  } catch (error: any) {
    console.error('Erro ao limpar notificações:', error);
    return res.status(500).json({ message: 'Erro ao limpar notificações.' });
  }
};
