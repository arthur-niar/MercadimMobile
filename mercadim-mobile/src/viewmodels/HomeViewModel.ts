import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { homeService, SalesItem } from '@/services/home.service';

export const useHomeViewModel = () => {
  const [username, setUsername] = useState('');
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

      const [name, homeData] = await Promise.all([
        authService.getUserName(),
        homeService.getHomeSummary(),
      ]);

      setUsername(name ?? '');
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

  useEffect(() => {
    loadData();
  }, []);

  return {
    username,
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