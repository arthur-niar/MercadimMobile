import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { homeService, SalesItem } from '@/services/home.service';
import * as notificationsService from '@/services/notifications.service';
import { useProfile } from '@/contexts/ProfileContext';
import { useTranslation } from '@/hooks/useTranslation';
import { formatNotificationDate } from '@/utils';
import { AppNotification } from './NotificationsViewModel';

export const useHomeViewModel = () => {
  const { profile } = useProfile();
  const { t, i18n } = useTranslation();
  const [totalSales, setTotalSales] = useState(0);
  const [itemsSold, setItemsSold] = useState(0);
  const [itemsReceived, setItemsReceived] = useState(0);
  const [averageTicket, setAverageTicket] = useState(0);
  const [salesItems, setSalesItems] = useState<SalesItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState<AppNotification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [homeData, notifications] = await Promise.all([
        homeService.getHomeSummary(),
        notificationsService.getNotifications()
      ]);

      setTotalSales(homeData.summary.totalSales);
      setItemsSold(homeData.summary.itemsSold);
      setItemsReceived(homeData.summary.itemsReceived);
      setAverageTicket(homeData.summary.averageTicket);
      setSalesItems(homeData.salesItems);
      
      const unread = notifications.filter(n => !n.read);
      setUnreadCount(unread.length);
      if (unread.length > 0) {
        const latest = unread[0];
        const currentLocale = i18n.language === 'en' ? 'en-US' : 'pt-BR';
        setLatestNotification({
          ...latest,
          date: formatNotificationDate(latest.date, currentLocale)
        });
      }
    } catch (err: any) {
      console.error(t('home.loadError'), err);
      setError(err.message || t('home.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return {
    username: profile?.name || '',
    profilePhotoUrl: profile?.url || null,
    totalSales,
    itemsSold,
    itemsReceived,
    averageTicket,
    salesItems,
    unreadCount,
    latestNotification,
    loading,
    error,
    refresh: loadData,
  };
};
