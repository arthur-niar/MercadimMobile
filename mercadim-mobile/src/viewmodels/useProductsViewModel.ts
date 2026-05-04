import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { Product } from '@/models/Product';
import {
  listProducts,
  createProduct,
  updateProduct as updateProductService,
  deleteProduct,
} from '@/services/productsService';

export const useProductsViewModel = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listProducts();
      setProducts(data);
    } catch (err: unknown) {
      setError(t('stock.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (data: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const created = await createProduct(data);
      setProducts(prev => [...prev, created]);
    } catch (err: unknown) {
      setError(t('stock.createError'));
      throw err;
    }
  };

  const updateProduct = async (
    id: string,
    data: Partial<Omit<Product, 'id' | 'createdAt'>>
  ) => {
    try {
      setError(null);
      const updated = await updateProductService(id, data);
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (err: unknown) {
      setError(t('stock.editError'));
      throw err;
    }
  };

  const removeProduct = async (id: string) => {
    const snapshot = products;
    try {
      setError(null);
      setProducts(prev => prev.filter(p => p.id !== id));
      await deleteProduct(id);
    } catch (err: any) {
      setProducts(snapshot);
      const errorMessage = err.message || t('stock.deleteError');
      setError(errorMessage);
      throw err;
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  return {
    products,
    loading,
    error,
    totalProducts: products.length,
    lowStockCount: products.filter(p => p.stock < 5).length,
    isEmpty: products.length === 0 && !loading,
    loadProducts,
    addProduct,
    updateProduct,
    removeProduct,
  };
};
