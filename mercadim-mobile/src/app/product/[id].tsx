import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ProductDetailView } from '@/views/ProductDetailView';
import { useProductDetailViewModel } from '@/viewmodels/ProductDetailViewModel';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { product, history, loading, error } = useProductDetailViewModel(id);

  return (
    <ProductDetailView
      product={product}
      history={history}
      loading={loading}
      error={error}
      onBack={() => router.back()}
    />
  );
}
