import { Product } from '@/models/Product';
import api from './api';

export const listProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products');
    return response.data.products || [];
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (
  data: Omit<Product, 'id' | 'createdAt'>
): Promise<Product> => {
  try {
    const response = await api.post('/products', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao criar produto');
  }
};

export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<Product> => {
  try {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao atualizar produto');
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error: any) {
    // Extrair mensagem de erro do backend
    const errorMessage = error.response?.data?.message || 'Erro ao deletar produto';
    throw new Error(errorMessage);
  }
};


