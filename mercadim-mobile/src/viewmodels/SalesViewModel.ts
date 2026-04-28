import { useMemo, useState } from 'react';

export type Product = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = Product & {
  quantity: number;
};

const PRODUCTS: Product[] = [
  { id: '1', name: 'Presunto', price: 13.5 },
  { id: '2', name: 'Queijo', price: 14.5 },
  { id: '3', name: 'Arroz 5kg', price: 25.9 },
  { id: '4', name: 'Feijão 1kg', price: 8.99 },
];

export const useSalesViewModel = () => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const openAddProduct = () => {
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
    if (!qtd || qtd <= 0) return;

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
        return prev.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + qtd }
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
    setQuantity(String(Number(quantity || 0) + 1));
  };

  const finalizeSale = () => {
    if (cart.length === 0) return;

    setSuccessMessage('Venda realizada com sucesso!');
    setCart([]);

    setTimeout(() => {
      setSuccessMessage('');
    }, 1800);
  };

  return {
    products,
    cart,
    selectedProduct,
    editingItem,
    quantity,
    modalVisible,
    successMessage,
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
  };
};