import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getSalesByUserId } from '../database/sales';
import { HomeResponse, SalesItem } from '../types';
import { supabase } from '../config/supabase';

export const getHomeSummary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      console.log('Usuário não autenticado');
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const userId = req.user.userId;
    console.log('Buscando resumo para usuário:', userId);

    const [userSales, { data: estoqueData }] = await Promise.all([
      getSalesByUserId(userId),
      supabase.from('estoque').select('quantprodutos').eq('idusuario', parseInt(userId))
    ]);

    const totalStock = (estoqueData || []).reduce((sum, e) => sum + (e.quantprodutos || 0), 0);

    if (userSales.length === 0) {
      console.log('Nenhuma venda encontrada para o usuário');
      return res.json({
        summary: {
          totalSales: 0,
          itemsSold: 0,
          itemsReceived: totalStock,
          averageTicket: 0,
        },
        salesItems: [],
      });
    }

    const totalSales = userSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    
    
    const itemsSold = userSales.reduce((sum, sale) => {
      const itemsQtd = sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
      return sum + itemsQtd;
    }, 0);
    
    const averageTicket = totalSales / userSales.length;

    const productMap = new Map<string, number>();
    userSales.forEach(sale => {
      sale.items.forEach(item => {
        const current = productMap.get(item.productName) || 0;
        productMap.set(item.productName, current + item.quantity);
      });
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

    const itemsReceived = totalStock + itemsSold;

    const response: HomeResponse = {
      summary: {
        totalSales,
        itemsSold,
        itemsReceived,
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
