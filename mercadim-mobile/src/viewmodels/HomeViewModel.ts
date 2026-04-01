import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';

export const useHomeViewModel = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const name = await authService.getUserName();
      setUsername(name ?? '');
    };
    loadUser();
  }, []);

  // TODO: substituir pelos dados reais da API quando o endpoint de resumo estiver pronto
  const totalSales = 0;
  const itemsSold = 0;
  const itemsReceived = 0;
  const averageTicket = 0;
  const salesItems: { name: string; quantity: number; color: string }[] = [];

  return {
    username,
    totalSales,
    itemsSold,
    itemsReceived,
    averageTicket,
    salesItems,
  };
};