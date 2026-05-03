import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { EstoqueView } from '@/views/EstoqueView';
import { ProductFormModal } from '@/components/ProductFormModal';
import { useProductsViewModel } from '@/viewmodels';
import { useProfile } from '@/contexts/ProfileContext';
import { Product } from '@/models/Product';

export default function EstoqueScreen() {
  const router = useRouter();
  const viewModel = useProductsViewModel();
  const { profile } = useProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
        username={profile?.name || ''}
        profilePhotoUrl={profile?.url || null}
        onSettingsPress={() => router.push('/configuracoes' as Href)}
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
