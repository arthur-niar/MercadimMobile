import { supabase } from '../config/supabase';
import { Notification } from '../types';

var x = '';
  
export const createNotification = async (
  notification: Omit<Notification, 'id' | 'createdAt'> & {
    titulo?: string;
    descricao?: string;
  }
): Promise<Notification> => {
  const notificationData = {
    ...notification,
    titulo: notification.titulo || 'Sem título',
    descricao: notification.descricao || 'Sem descrição',
  };

  const { data, error } = await supabase
    .from('notificacao')
    .insert([notificationData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export const lowStockNotification = async (
    userId: string,
    productId: string,
    productName: string,
    quantity: number
): Promise<Notification> => {
    const notification: Omit<Notification, 'id' | 'createdAt'> = {
        userId,
        titulo: `Estoque baixo ${productName}`,
        descricao: `O produto ${productName} está com estoque baixo.`
    };

    return createNotification(notification);

}
