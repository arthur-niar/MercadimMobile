import { useState } from 'react';

export type AppNotification = {
  id: number;
  title: string;
  description: string;
  date: string;
  read: boolean;
};

export const useNotificationsViewModel = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 1,
      title: 'Estoque baixo',
      description: 'O produto Arroz está com poucas unidades disponíveis.',
      date: 'Hoje, 14:30',
      read: false,
    },
    {
      id: 2,
      title: 'Venda realizada',
      description: 'Uma nova venda foi registrada no sistema.',
      date: 'Ontem, 18:10',
      read: false,
    },
    {
      id: 3,
      title: 'Resumo semanal',
      description: 'Seu relatório semanal de vendas já está disponível.',
      date: 'Segunda-feira, 09:00',
      read: true,
    },
  ]);

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