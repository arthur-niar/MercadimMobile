import { useMemo, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Alert } from 'react-native';
import api from '../services/api';
import { useProfile } from '@/contexts/ProfileContext';
import { useTranslation } from '@/hooks/useTranslation';

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export type CartItem = Product & {
  quantity: number;
};

export const useSalesViewModel = () => {
  const { profile } = useProfile();
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);

  const loadData = async () => {
    try {
      const response = await api.get('/products');
      const stockProducts = response.data.products.filter((p: Product) => p.stock > 0);
      setProducts(stockProducts);
    } catch (error) {
      console.error(t('sales.loadError'), error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const openAddProduct = () => {
    if (products.length === 0) {
        Alert.alert(t('sales.noProductsTitle'), t('sales.noProductsMsg'));
        return;
    }
    setEditingItem(null);
    setSelectedProduct(products[0]);
    setQuantity('1');
    setModalVisible(true);
  };

  const openEditItem = (item: CartItem) => {
    setEditingItem(item);
    setSelectedProduct(item);
    setQuantity(String(item.quantity));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
  };

  const addOrUpdateCart = () => {
    if (!selectedProduct) return;

    const qtd = Number(quantity);
    if (!qtd || qtd <= 0) {
      Alert.alert(t('sales.invalidQuantityTitle'), t('sales.invalidQuantityMsg'));
      return;
    }

    if (qtd > selectedProduct.stock) {
      Alert.alert(t('sales.insufficientStockTitle'), t('sales.insufficientStockMsg', { name: selectedProduct.name, stock: selectedProduct.stock }));
      return;
    }

    if (editingItem) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, quantity: qtd } : item
        )
      );
      closeModal();
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === selectedProduct.id);

      if (existing) {
        const newTotalQtd = existing.quantity + qtd;
        if (newTotalQtd > selectedProduct.stock) {
           Alert.alert(t('sales.insufficientStockTitle'), t('sales.insufficientStockMsg', { name: selectedProduct.name, stock: selectedProduct.stock }));
           return prev;
        }

        return prev.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, quantity: newTotalQtd }
            : item
        );
      }

      return [...prev, { ...selectedProduct, quantity: qtd }];
    });

    closeModal();
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const decreaseQuantity = () => {
    const value = Math.max(1, Number(quantity || 1) - 1);
    setQuantity(String(value));
  };

  const increaseQuantity = () => {
    const value = Number(quantity || 0) + 1;
    if (selectedProduct && value > selectedProduct.stock) {
       Alert.alert(t('sales.attention'), t('sales.stockLimitReached'));
       return;
    }
    setQuantity(String(value));
  };

  const finalizeSale = async () => {
    if (cart.length === 0) return;

    const items = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity
    }));

    try {
      setIsFinalizing(true);
      await api.post('/sales', { items });
      
      setIsFinalizing(false);
      setSuccessMessage(t('sales.vendaSuccess'));
      setCart([]);
      
      loadData();

      setTimeout(() => {
        setSuccessMessage('');
      }, 2500);
    } catch (error: any) {
       setIsFinalizing(false);
       Alert.alert(t('sales.saleError'), error.response?.data?.message || t('sales.saleErrorMsg'));
    }
  };

  return {
    username: profile?.name || '',
    profilePhotoUrl: profile?.url || null,
    products,
    cart,
    selectedProduct,
    editingItem,
    quantity,
    modalVisible,
    successMessage,
    isFinalizing,
    total,
    totalItems,

    setSelectedProduct,
    setQuantity,
    openAddProduct,
    openEditItem,
    closeModal,
    addOrUpdateCart,
    removeItem,
    decreaseQuantity,
    increaseQuantity,
    finalizeSale,
    refresh: loadData,
  };
};
