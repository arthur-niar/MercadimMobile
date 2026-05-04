import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export type AppNotification = {
  id: number;
  title: string;
  description: string;
  date: string;
  read: boolean;
};

export const useNotificationsViewModel = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: t('notifications.lowStockTitle'),
        description: t('notifications.lowStockDesc', { name: 'Arroz' }),
        date: t('notifications.today', { time: '14:30' }),
        read: false,
      },
      {
        id: 2,
        title: t('notifications.saleTitle'),
        description: t('notifications.saleDesc'),
        date: t('notifications.yesterday', { time: '18:10' }),
        read: false,
      },
      {
        id: 3,
        title: t('notifications.weeklySummaryTitle'),
        description: t('notifications.weeklySummaryDesc'),
        date: t('notifications.monday', { time: '09:00' }),
        read: true,
      },
    ]);
  }, [t]);

  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);

  const markAsRead = (id: number) => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const openNotification = (notification: AppNotification) => {
    setSelectedNotification(notification);
    markAsRead(notification.id);
  };

  const closeNotification = () => {
    setSelectedNotification(null);
  };

  return {
    notifications,
    selectedNotification,
    markAsRead,
    openNotification,
    closeNotification,
  };
};