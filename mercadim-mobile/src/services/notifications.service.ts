import api from './api';
import { AppNotification } from '../viewmodels/NotificationsViewModel';

export const getNotifications = async (): Promise<AppNotification[]> => {
  const response = await api.get('/notifications');
  return response.data.notifications;
};

export const markAsRead = async (id: number): Promise<void> => {
  await api.put(`/notifications/${id}/read`);
};

export const clearNotifications = async (): Promise<void> => {
  await api.delete('/notifications');
};
