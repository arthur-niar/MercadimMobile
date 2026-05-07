import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import * as notificationsService from '@/services/notifications.service';
import { formatNotificationDate } from '@/utils';


export type AppNotification = {
  id: number;
  title: string;
  description: string;
  type?: string;
  date: string;
  read: boolean;
};

export const useNotificationsViewModel = () => {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationsService.getNotifications();
      const currentLocale = i18n.language === 'en' ? 'en-US' : 'pt-BR';
      const formattedData = data.map(notif => ({
        ...notif,
        date: formatNotificationDate(notif.date, currentLocale)
      }));
      setNotifications(formattedData);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);

  const markAsRead = async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const openNotification = (notification: AppNotification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const closeNotification = () => {
    setSelectedNotification(null);
  };

  const clearAllNotifications = async () => {
    try {
      await notificationsService.clearNotifications();
      setNotifications([]);
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
    }
  };

  return {
    notifications,
    selectedNotification,
    loading,
    markAsRead,
    openNotification,
    closeNotification,
    clearAllNotifications,
    refreshNotifications: fetchNotifications,
  };
};