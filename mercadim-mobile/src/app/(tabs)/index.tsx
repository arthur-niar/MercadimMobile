// SUBSTITUI: src/app/(tabs)/index.tsx
// Mudança: onSettingsPress agora navega para /configuracoes

import React from 'react';
import { useRouter } from 'expo-router';
import { HomeView } from '@/views';
import { useHomeViewModel } from '@/viewmodels';

export default function HomeScreen() {
  const router = useRouter();
  const viewModel = useHomeViewModel();

  return (
    <HomeView
      username={viewModel.username}
      profilePhotoUrl={viewModel.profilePhotoUrl}
      totalSales={viewModel.totalSales}
      itemsSold={viewModel.itemsSold}
      itemsReceived={viewModel.itemsReceived}
      averageTicket={viewModel.averageTicket}
      salesItems={viewModel.salesItems}
      unreadCount={viewModel.unreadCount}
      latestNotification={viewModel.latestNotification}
      loading={viewModel.loading}
      error={viewModel.error}
      onRefresh={viewModel.refresh}
      onSettingsPress={() => router.push('/configuracoes' as any)}
      onReportPress={() => {}}
    />
  );
}