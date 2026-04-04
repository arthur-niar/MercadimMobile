import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getSalesByUserId } from '../database/sales';
import { HomeResponse, SalesItem } from '../types';

export const getHomeSummary = (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      console.log('Usuário não autenticado');
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const userId = req.user.userId;
    console.log('Buscando resumo para usuário:', userId);

    const userSales = getSalesByUserId(userId);

    if (userSales.length === 0) {
      console.log('Nenhuma venda encontrada para o usuário');
      return res.json({
        summary: {
          totalSales: 0,
          itemsSold: 0,
          itemsReceived: 0,
          averageTicket: 0,
        },
        salesItems: [],
      });
    }

    const totalSales = userSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const itemsSold = userSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const averageTicket = totalSales / userSales.length;

    const productMap = new Map<string, number>();
    userSales.forEach(sale => {
      const current = productMap.get(sale.productName) || 0;
      productMap.set(sale.productName, current + sale.quantity);
    });

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const salesItems: SalesItem[] = Array.from(productMap.entries())
      .map(([name, quantity], index) => ({
        name,
        quantity,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    const response: HomeResponse = {
      summary: {
        totalSales,
        itemsSold,
        itemsReceived: 0,
        averageTicket,
      },
      salesItems,
    };

    console.log('Resumo gerado com sucesso');
    return res.json(response);
  } catch (error) {
    console.error('Erro ao buscar resumo:', error);
    return res.status(500).json({ message: 'Erro ao buscar resumo da home' });
  }
};
