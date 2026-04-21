// TODO: trocar implementação por chamadas HTTP quando o backend existir.
// A assinatura das funções exportadas NÃO deve mudar — só o corpo.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/models/Product';

const STORAGE_KEY = '@mercadim:products';

const delay = () => new Promise<void>(r => setTimeout(r, 300));

const readAll = async (): Promise<Product[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Product[]) : [];
};

const writeAll = async (products: Product[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const listProducts = async (): Promise<Product[]> => {
  await delay();
  return readAll();
};

export const createProduct = async (
  data: Omit<Product, 'id' | 'createdAt'>
): Promise<Product> => {
  await delay();
  const products = await readAll();
  const newProduct: Product = {
    ...data,
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
  };
  await writeAll([...products, newProduct]);
  return newProduct;
};

export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<Product> => {
  await delay();
  const products = await readAll();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) throw new Error(`Produto com id "${id}" não encontrado.`);
  const updated: Product = { ...products[index], ...data };
  const next = [...products];
  next[index] = updated;
  await writeAll(next);
  return updated;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await delay();
  const products = await readAll();
  const next = products.filter(p => p.id !== id);
  if (next.length === products.length) {
    throw new Error(`Produto com id "${id}" não encontrado.`);
  }
  await writeAll(next);
};
