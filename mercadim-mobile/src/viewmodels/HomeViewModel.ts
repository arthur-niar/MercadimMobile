import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { homeService, SalesItem } from '@/services/home.service';
import { useProfile } from '@/contexts/ProfileContext';

export const useHomeViewModel = () => {
  const { profile } = useProfile();
  const [totalSales, setTotalSales] = useState(0);
  const [itemsSold, setItemsSold] = useState(0);
  const [itemsReceived, setItemsReceived] = useState(0);
  const [averageTicket, setAverageTicket] = useState(0);
  const [salesItems, setSalesItems] = useState<SalesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const homeData = await homeService.getHomeSummary();

      setTotalSales(homeData.summary.totalSales);
      setItemsSold(homeData.summary.itemsSold);
      setItemsReceived(homeData.summary.itemsReceived);
      setAverageTicket(homeData.summary.averageTicket);
      setSalesItems(homeData.salesItems);
    } catch (err: any) {
      console.error('Erro ao carregar dados da home:', err);
      setError(err.message || 'Erro ao carregar dados');
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
    loading,
    error,
    refresh: loadData,
  };
};
