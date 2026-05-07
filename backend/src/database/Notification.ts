import { supabase } from '../config/supabase';
import { Notification } from '../types';

export const getNotificationsByUserId = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notificacao')
    .select('*')
    .eq('idusuario', parseInt(userId))
    .order('datacriacao', { ascending: false });

  if (error) throw error;

  return (data || []).map((notif: any) => ({
    id: notif.idnotificacao,
    userId: notif.idusuario.toString(),
    title: notif.titulo,
    description: notif.descricao,
    type: notif.tipo,
    read: notif.lida,
    date: notif.datacriacao
  }));
};

export const markNotificationAsRead = async (notificationId: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notificacao')
    .update({ lida: true })
    .eq('idnotificacao', parseInt(notificationId))
    .eq('idusuario', parseInt(userId));

  if (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    throw error;
  }

  return true;
};

export const deleteAllNotificationsByUserId = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notificacao')
    .delete()
    .eq('idusuario', parseInt(userId));

  if (error) {
    console.error('Erro ao deletar notificações:', error);
    throw error;
  }

  return true;
};
