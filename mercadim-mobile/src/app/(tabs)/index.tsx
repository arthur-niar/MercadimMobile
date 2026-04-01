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
      totalSales={viewModel.totalSales}
      itemsSold={viewModel.itemsSold}
      itemsReceived={viewModel.itemsReceived}
      averageTicket={viewModel.averageTicket}
      salesItems={viewModel.salesItems}
      onSettingsPress={() => router.push('/(tabs)/perfil' as any)}
      onReportPress={() => {}}
    />
  );
}