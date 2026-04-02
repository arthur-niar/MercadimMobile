import { Sale } from '../types';

const sales: Sale[] = [];

export const createSale = (sale: Omit<Sale, 'id' | 'createdAt'>): Sale => {
  const newSale: Sale = {
    ...sale,
    id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
  };
  sales.push(newSale);
  console.log('Venda criada:', newSale.id);
  return newSale;
};

export const getSalesByUserId = (userId: string): Sale[] => {
  return sales.filter(sale => sale.userId === userId);
};

export const getAllSales = (): Sale[] => {
  return sales;
};

export const hasSales = (): boolean => {
  return sales.length > 0;
};

export const deleteSale = (id: string): boolean => {
  const index = sales.findIndex(sale => sale.id === id);
  if (index !== -1) {
    sales.splice(index, 1);
    console.log('Venda deletada:', id);
    return true;
  }
  return false;
};
