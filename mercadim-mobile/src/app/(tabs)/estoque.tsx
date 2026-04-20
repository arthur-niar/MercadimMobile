import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { EstoqueView } from '@/views/EstoqueView';
import { ProductFormModal } from '@/components/ProductFormModal';
import { useProductsViewModel } from '@/viewmodels';
import { authService } from '@/services/auth.service';
import { Product } from '@/models/Product';

export default function EstoqueScreen() {
  const router = useRouter();
  const viewModel = useProductsViewModel();

  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    authService.getUserName().then(name => setUsername(name ?? ''));
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Omit<Product, 'id' | 'createdAt'>) => {
    if (editingProduct) {
      await viewModel.updateProduct(editingProduct.id, data);
    } else {
      await viewModel.addProduct(data);
    }
  };

  return (
    <>
      <EstoqueView
        username={username}
        onSettingsPress={() => router.push('/(tabs)/perfil' as Href)}
        onCreatePress={handleOpenCreate}
        products={viewModel.products}
        loading={viewModel.loading}
        error={viewModel.error}
        isEmpty={viewModel.isEmpty}
        totalProducts={viewModel.totalProducts}
        lowStockCount={viewModel.lowStockCount}
        onEditPress={handleOpenEdit}
        onDeletePress={viewModel.removeProduct}
        onRefresh={viewModel.loadProducts}
        onRetry={viewModel.loadProducts}
      />

      <ProductFormModal
        visible={isModalOpen}
        mode={editingProduct ? 'edit' : 'create'}
        initialData={editingProduct ?? undefined}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
