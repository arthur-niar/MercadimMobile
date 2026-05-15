import { useState, useCallback, useEffect } from 'react';
import { Product } from '@/models/Product';
import { getProduct, getProductHistory } from '@/services/productsService';

export interface ProductMovement {
  id: string;
  type: 'entrada' | 'saida';
  quantity: number;
  date: string;
  description: string;
  value?: number;
}

export function useProductDetailViewModel(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [history, setHistory] = useState<ProductMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProductData = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      setError(null);
      const [productData, historyData] = await Promise.all([
        getProduct(productId),
        getProductHistory(productId)
      ]);
      setProduct(productData);
      setHistory(historyData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do produto');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  return {
    product,
    history,
    loading,
    error,
    loadProductData,
  };
}
